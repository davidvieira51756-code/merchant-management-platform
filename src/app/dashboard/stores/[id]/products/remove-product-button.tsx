"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type RemoveProductButtonProps = {
  productId: string;
};

export default function RemoveProductButton({
  productId,
}: RemoveProductButtonProps) {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRemove() {
    const confirmed = window.confirm(
      "Are you sure you want to remove this product?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { data: deletedProduct, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .select("id")
      .single();

    if (error || !deletedProduct) {
      setErrorMessage(
        error?.message ?? "Product could not be removed."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleRemove}
        disabled={loading}
        className="text-sm font-medium text-red-600 disabled:opacity-50"
      >
        {loading ? "Removing..." : "Remove"}
      </button>

      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
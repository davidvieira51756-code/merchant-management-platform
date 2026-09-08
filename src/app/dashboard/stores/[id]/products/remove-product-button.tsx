"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
    <div className="min-w-0">
      <Button
        type="button"
        variant="ghost"
        onClick={handleRemove}
        disabled={loading}
        aria-busy={loading}
        className="h-10 min-w-24 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
      >
        {loading ? "Removing..." : "Remove"}
      </Button>

      {errorMessage && (
        <p
          role="alert"
          className="mt-2 break-words text-xs leading-5 text-destructive [overflow-wrap:anywhere]"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
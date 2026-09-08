"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type DeactivateStoreButtonProps = {
  storeId: string;
  active: boolean;
};

export default function DeactivateStoreButton({
  storeId,
  active,
}: DeactivateStoreButtonProps) {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDeactivate() {
    setLoading(true);
    setErrorMessage(null);

    const { data: updatedStore, error } = await supabase
      .from("stores")
      .update({ active: false })
      .eq("id", storeId)
      .select("id")
      .single();

    if (error || !updatedStore) {
      setErrorMessage(
        error?.message ?? "Store could not be deactivated."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  if (!active) {
    return (
      <span className="text-sm text-muted-foreground">
        Inactive
      </span>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDeactivate}
        disabled={loading}
        className="text-sm font-medium text-red-600 disabled:opacity-50"
      >
        {loading ? "Deactivating..." : "Deactivate"}
      </button>

      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
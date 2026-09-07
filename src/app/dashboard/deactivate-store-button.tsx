"use client";

import { useState } from "react";
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
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDeactivate() {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase
      .from("stores")
      .update({ active: false })
      .eq("id", storeId);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

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
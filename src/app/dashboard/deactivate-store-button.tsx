"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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

    try {
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
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!active) {
    return (
      <span className="text-sm text-muted-foreground">
        Inactive
      </span>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Button
        type="button"
        variant="ghost"
        onClick={handleDeactivate}
        disabled={loading}
        aria-busy={loading}
        className="h-10 w-full px-2 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
      >
        {loading ? "Deactivating..." : "Deactivate"}
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

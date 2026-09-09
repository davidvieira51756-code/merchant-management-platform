"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const submissionGuardRef = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout() {
    if (submissionGuardRef.current) return;
    submissionGuardRef.current = true;
    let navigationStarted = false;
    setIsPending(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setErrorMessage("Unable to log out. Please try again.");
        return;
      }
      router.push("/login");
      navigationStarted = true;
    } catch {
      setErrorMessage("Unable to log out. Please try again.");
    } finally {
      if (!navigationStarted) {
        submissionGuardRef.current = false;
        setIsPending(false);
      }
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={isPending}
        aria-busy={isPending}
        className="h-10 px-4"
      >
        {isPending ? "Logging out..." : "Logout"}
      </Button>
      {errorMessage && (
        <p role="alert" className="mt-2 max-w-56 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

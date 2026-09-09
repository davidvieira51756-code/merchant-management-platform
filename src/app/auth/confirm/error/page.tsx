import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ConfirmationErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Unable to confirm email</h1>
        <p role="alert" className="mt-3 text-sm leading-6 text-muted-foreground">
          This confirmation link may be invalid, expired, or already used. If you
          have already confirmed your email, you can log in. Otherwise, use the
          latest confirmation email or try creating your account again.
        </p>
        <Link href="/login" className={buttonVariants({ className: "mt-6 h-11 px-5" })}>
          Back to login
        </Link>
      </div>
    </main>
  );
}

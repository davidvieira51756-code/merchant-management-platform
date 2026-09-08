import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Merchant Management Platform
        </h1>

        <p className="mt-4 text-muted-foreground">
          Manage your stores and products securely from one dashboard.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/login"
            className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
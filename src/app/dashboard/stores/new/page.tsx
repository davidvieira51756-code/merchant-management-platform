"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewStorePage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("Europe/Lisbon");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("You must be logged in to create a store.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("stores").insert({
      merchant_id: user.id,
      name,
      street,
      city,
      state,
      zip_code: zipCode,
      phone,
      timezone,
      active: true,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Create Store</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a new store to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="street" className="mb-1 block text-sm font-medium">
              Street
            </label>
            <input
              id="street"
              value={street}
              onChange={(event) => setStreet(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium">
              City
            </label>
            <input
              id="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="state" className="mb-1 block text-sm font-medium">
              State
            </label>
            <input
              id="state"
              value={state}
              onChange={(event) => setState(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="mb-1 block text-sm font-medium">
              Zip Code
            </label>
            <input
              id="zipCode"
              value={zipCode}
              onChange={(event) => setZipCode(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="timezone" className="mb-1 block text-sm font-medium">
              Timezone
            </label>
            <input
              id="timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Store"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-md border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
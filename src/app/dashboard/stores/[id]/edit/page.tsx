"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const storeId = params.id as string;

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStore() {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .single();

      if (error || !data) {
        setErrorMessage("Store not found.");
        setLoading(false);
        return;
      }

      setName(data.name);
      setStreet(data.street);
      setCity(data.city);
      setState(data.state);
      setZipCode(data.zip_code);
      setPhone(data.phone);
      setTimezone(data.timezone);

      setLoading(false);
    }

    loadStore();
  }, [storeId, supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setSaving(true);

    const { error } = await supabase
      .from("stores")
      .update({
        name,
        street,
        city,
        state,
        zip_code: zipCode,
        phone,
        timezone,
      })
      .eq("id", storeId);

    if (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold">Edit Store</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              disabled={saving}
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
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
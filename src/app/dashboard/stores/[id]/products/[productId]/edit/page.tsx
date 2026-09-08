"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const storeId = params.id as string;
  const productId = params.productId as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("store_id", storeId)
        .single();

      if (error || !data) {
        setErrorMessage("Product not found.");
        setLoading(false);
        return;
      }

      setName(data.name);
      setDescription(data.description ?? "");
      setPrice(String(data.price));
      setAvailable(data.available);

      setLoading(false);
    }

    loadProduct();
  }, [productId, storeId, supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage(null);

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage("Price must be a valid positive number.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description: description || null,
        price: numericPrice,
        available,
      })
      .eq("id", productId)
      .eq("store_id", storeId);

    if (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    router.push(`/dashboard/stores/${storeId}/products`);
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
        <h1 className="text-3xl font-semibold">Edit Product</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update product information.
        </p>

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
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Price
            </label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="available"
              type="checkbox"
              checked={available}
              onChange={(event) => setAvailable(event.target.checked)}
            />

            <label htmlFor="available" className="text-sm font-medium">
              Available
            </label>
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
              onClick={() =>
                router.push(`/dashboard/stores/${storeId}/products`)
              }
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
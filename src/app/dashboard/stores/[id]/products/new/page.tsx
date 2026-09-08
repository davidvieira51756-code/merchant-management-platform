"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/supabase/client";
import {
  productSchema,
  ProductFormInput,
  ProductFormValues,
} from "@/lib/validations/products";

export default function NewProductPage() {
  const params = useParams();
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const storeId = params.id as string;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      description: "",
      price: 0,
      available: true,
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setErrorMessage(null);

    const { error } = await supabase.from("products").insert({
      store_id: storeId,
      name: data.name,
      description: data.description || null,
      price: data.price,
      available: data.available,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push(`/dashboard/stores/${storeId}/products`);
    router.refresh();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold">Add Product</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Add a new product to this store.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium"
            >
              Name
            </label>

            <input
              id="name"
              {...register("name")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
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
              {...register("description")}
              rows={4}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-1 block text-sm font-medium"
            >
              Price
            </label>

            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="available"
              type="checkbox"
              {...register("available")}
            />

            <label
              htmlFor="available"
              className="text-sm font-medium"
            >
              Available
            </label>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
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
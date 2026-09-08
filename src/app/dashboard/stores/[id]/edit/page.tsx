"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/supabase/client";
import {
  storeSchema,
  StoreFormValues,
} from "@/lib/validations/store";

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();

  const supabase = useMemo(() => createClient(), []);

  const storeId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      timezone: "",
    },
  });

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

      reset({
        name: data.name,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        phone: data.phone,
        timezone: data.timezone,
      });

      setLoading(false);
    }

    loadStore();
  }, [storeId, supabase, reset]);

  async function onSubmit(data: StoreFormValues) {
    setErrorMessage(null);

    const { error } = await supabase
      .from("stores")
      .update({
        name: data.name,
        street: data.street,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        phone: data.phone,
        timezone: data.timezone,
      })
      .eq("id", storeId);

    if (error) {
      setErrorMessage(error.message);
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
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
            <label htmlFor="street" className="mb-1 block text-sm font-medium">
              Street
            </label>

            <input
              id="street"
              {...register("street")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.street && (
              <p className="mt-1 text-sm text-red-600">
                {errors.street.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium">
              City
            </label>

            <input
              id="city"
              {...register("city")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.city && (
              <p className="mt-1 text-sm text-red-600">
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="mb-1 block text-sm font-medium">
              State
            </label>

            <input
              id="state"
              {...register("state")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="mb-1 block text-sm font-medium">
              Zip Code
            </label>

            <input
              id="zipCode"
              {...register("zipCode")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.zipCode.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Phone
            </label>

            <input
              id="phone"
              {...register("phone")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="timezone" className="mb-1 block text-sm font-medium">
              Timezone
            </label>

            <input
              id="timezone"
              {...register("timezone")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.timezone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.timezone.message}
              </p>
            )}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
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
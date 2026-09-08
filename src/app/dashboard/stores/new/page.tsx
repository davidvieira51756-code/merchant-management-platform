"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/supabase/client";
import {
  storeSchema,
  StoreFormValues,
} from "@/lib/validations/store";

export default function NewStorePage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
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
      timezone: "Europe/Lisbon",
    },
  });

  async function onSubmit(data: StoreFormValues) {
    setErrorMessage(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("You must be logged in to create a store.");
      return;
    }

    const { error } = await supabase.from("stores").insert({
      merchant_id: user.id,
      name: data.name,
      street: data.street,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode,
      phone: data.phone,
      timezone: data.timezone,
      active: true,
    });

    if (error) {
      setErrorMessage(error.message);
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
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
              htmlFor="street"
              className="mb-1 block text-sm font-medium"
            >
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
            <label
              htmlFor="city"
              className="mb-1 block text-sm font-medium"
            >
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
            <label
              htmlFor="state"
              className="mb-1 block text-sm font-medium"
            >
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
            <label
              htmlFor="zipCode"
              className="mb-1 block text-sm font-medium"
            >
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
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium"
            >
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
            <label
              htmlFor="timezone"
              className="mb-1 block text-sm font-medium"
            >
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
              {isSubmitting ? "Creating..." : "Create Store"}
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
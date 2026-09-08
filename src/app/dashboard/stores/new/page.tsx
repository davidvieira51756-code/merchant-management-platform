"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  storeSchema,
  type StoreFormValues,
} from "@/lib/validations/store";

const inputClassName =
  "h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20 sm:text-sm";

const labelClassName = "mb-2 block text-sm font-medium";

const errorClassName = "mt-2 text-sm text-destructive";

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
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create store
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add your store details and location.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-busy={isSubmitting}
          className="mt-8"
        >
          <fieldset className="min-w-0">
            <legend className="text-base font-semibold">
              Store details
            </legend>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <label htmlFor="name" className={labelClassName}>
                  Store name
                </label>

                <input
                  id="name"
                  autoComplete="organization"
                  placeholder="e.g. Braga Central"
                  {...register("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={inputClassName}
                />

                {errors.name && (
                  <p id="name-error" className={errorClassName}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelClassName}>
                  Phone
                </label>

                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. +351 253 123 456"
                  {...register("phone")}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={inputClassName}
                />

                {errors.phone && (
                  <p id="phone-error" className={errorClassName}>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="my-8 border-t" />

          <fieldset className="min-w-0">
            <legend className="text-base font-semibold">
              Location
            </legend>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="street" className={labelClassName}>
                  Street address
                </label>

                <input
                  id="street"
                  autoComplete="address-line1"
                  placeholder="Street name and number"
                  {...register("street")}
                  aria-invalid={Boolean(errors.street)}
                  aria-describedby={
                    errors.street ? "street-error" : undefined
                  }
                  className={inputClassName}
                />

                {errors.street && (
                  <p id="street-error" className={errorClassName}>
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="city" className={labelClassName}>
                  City
                </label>

                <input
                  id="city"
                  autoComplete="address-level2"
                  placeholder="e.g. Braga"
                  {...register("city")}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? "city-error" : undefined}
                  className={inputClassName}
                />

                {errors.city && (
                  <p id="city-error" className={errorClassName}>
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="state" className={labelClassName}>
                  State / Region
                </label>

                <input
                  id="state"
                  autoComplete="address-level1"
                  placeholder="e.g. Braga"
                  {...register("state")}
                  aria-invalid={Boolean(errors.state)}
                  aria-describedby={errors.state ? "state-error" : undefined}
                  className={inputClassName}
                />

                {errors.state && (
                  <p id="state-error" className={errorClassName}>
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="zipCode" className={labelClassName}>
                  Postal code
                </label>

                <input
                  id="zipCode"
                  autoComplete="postal-code"
                  placeholder="e.g. 4700-001"
                  {...register("zipCode")}
                  aria-invalid={Boolean(errors.zipCode)}
                  aria-describedby={
                    errors.zipCode ? "zipCode-error" : undefined
                  }
                  className={inputClassName}
                />

                {errors.zipCode && (
                  <p id="zipCode-error" className={errorClassName}>
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="timezone" className={labelClassName}>
                  Timezone
                </label>

                <input
                  id="timezone"
                  spellCheck={false}
                  autoCapitalize="none"
                  {...register("timezone")}
                  aria-invalid={Boolean(errors.timezone)}
                  aria-describedby={
                    errors.timezone
                      ? "timezone-hint timezone-error"
                      : "timezone-hint"
                  }
                  className={inputClassName}
                />

                <p
                  id="timezone-hint"
                  className="mt-2 text-xs leading-5 text-muted-foreground"
                >
                  Use a timezone such as Europe/Lisbon.
                </p>

                {errors.timezone && (
                  <p id="timezone-error" className={errorClassName}>
                    {errors.timezone.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {errorMessage && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {errorMessage}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="h-11 px-5"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 min-w-32 px-5"
            >
              {isSubmitting ? "Creating..." : "Create store"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
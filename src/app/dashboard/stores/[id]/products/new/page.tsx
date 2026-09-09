"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "@/lib/validations/products";

const fieldClassName =
  "w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20 sm:text-sm";

const labelClassName = "mb-2 block text-sm font-medium";

const errorClassName = "mt-2 text-sm text-destructive";

export default function NewProductPage() {
  const params = useParams();
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const storeId = params.id as string;

  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
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
    setIsPending(true);
    setErrorMessage(null);

    try {
      const { data: createdProduct, error } = await supabase
        .from("products")
        .insert({
          store_id: storeId,
          name: data.name,
          description: data.description || null,
          price: data.price,
          available: data.available,
        })
        .select("id")
        .single();

      if (error || !createdProduct) {
        setErrorMessage(error?.message ?? "Product could not be created.");
        return;
      }

      router.push(`/dashboard/stores/${storeId}/products`);
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/dashboard/stores/${storeId}/products`}
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span aria-hidden="true">←</span>
          Back to products
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Add product
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add a new product to this store.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-busy={isPending}
          className="mt-8"
        >
          <fieldset className="min-w-0">
            <legend className="text-base font-semibold">
              Product details
            </legend>

            <div className="mt-5 space-y-5">
              <div>
                <Label htmlFor="name" className={labelClassName}>
                  Product name
                </Label>

                <Input
                  id="name"
                  placeholder="e.g. Cotton tote bag"
                  {...register("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "name-error" : undefined
                  }
                  className={`${fieldClassName} h-11`}
                />

                {errors.name && (
                  <p id="name-error" className={errorClassName}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className={labelClassName}>
                  Description
                </Label>

                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the product and its main features."
                  {...register("description")}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  className={`${fieldClassName} min-h-28 resize-y py-3 leading-6`}
                />

                {errors.description && (
                  <p id="description-error" className={errorClassName}>
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="my-8 border-t" />

          <fieldset className="min-w-0">
            <legend className="text-base font-semibold">
              Price and availability
            </legend>

            <div className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
              <div>
                <Label htmlFor="price" className={labelClassName}>
                  Price (EUR)
                </Label>

                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                  >
                    €
                  </span>

                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    {...register("price")}
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={
                      errors.price ? "price-error" : undefined
                    }
                    className={`${fieldClassName} h-11 pl-8 tabular-nums`}
                  />
                </div>

                {errors.price && (
                  <p id="price-error" className={errorClassName}>
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="sm:pt-7">
                <Label
                  htmlFor="available"
                  className="flex min-h-11 cursor-pointer items-start gap-3 py-2"
                >
                  <Controller
                    name="available"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="available"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                        inputRef={field.ref}
                        aria-invalid={Boolean(errors.available)}
                        aria-describedby={
                          errors.available
                            ? "available-hint available-error"
                            : "available-hint"
                        }
                        className="mt-0.5 size-4 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      />
                    )}
                  />

                  <span className="text-sm font-medium">
                    Available
                  </span>
                </Label>

                <p
                  id="available-hint"
                  className="ml-7 text-xs leading-5 text-muted-foreground"
                >
                  Mark this product as available in this store.
                </p>

                {errors.available && (
                  <p id="available-error" className={errorClassName}>
                    {errors.available.message}
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
              onClick={() =>
                router.push(`/dashboard/stores/${storeId}/products`)
              }
              className="h-11 px-5"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 min-w-32 px-5"
            >
              {isPending ? "Adding..." : "Add product"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

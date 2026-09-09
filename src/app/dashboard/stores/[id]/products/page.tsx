import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

import RemoveProductButton from "./remove-product-button";

type ProductsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductsPage({
  params,
}: ProductsPageProps) {
  const { id: storeId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, name")
    .eq("id", storeId)
    .single();

  if (storeError || !store) {
    notFound();
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (productsError) {
    throw new Error("Failed to load products");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-3xl font-semibold tracking-tight [overflow-wrap:anywhere]">
              {store.name}
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Manage products for this store.
            </p>
          </div>

          <Link
            href={`/dashboard/stores/${storeId}/products/new`}
            className={buttonVariants({
              className: "h-11 w-full gap-2 px-5 sm:w-auto",
            })}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            Add product
          </Link>
        </header>

        <section aria-labelledby="products-heading" className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2
              id="products-heading"
              className="text-lg font-semibold tracking-tight"
            >
              Products
            </h2>

            <Badge variant="secondary" className="h-auto rounded-md border-0 bg-secondary px-2 py-0.5 text-xs font-medium tabular-nums text-secondary-foreground">
              {products.length}
            </Badge>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center border-y px-6 py-16 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-10 text-muted-foreground"
              >
                <path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" />
                <path d="m3 8 9 5 9-5" />
                <path d="M12 13v8" />
                <path d="m7.5 5.5 9 5" />
              </svg>

              <h3 className="mt-5 text-lg font-semibold">
                No products yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Add your first product to this store.
              </p>

              <Link
                href={`/dashboard/stores/${storeId}/products/new`}
                className={buttonVariants({
                  className: "mt-6 h-11 px-5",
                })}
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="border-y bg-card">
              <div
                aria-hidden="true"
                className="hidden grid-cols-[minmax(0,1fr)_7rem_9rem_11rem] items-center gap-6 border-b bg-muted/40 px-5 py-3 text-xs font-medium text-muted-foreground lg:grid"
              >
                <span>Product</span>
                <span className="text-right">Price</span>
                <span>Availability</span>
                <span className="text-center">Actions</span>
              </div>

              <ul className="divide-y divide-border">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="grid min-w-0 grid-cols-1 gap-4 px-5 py-5 transition-colors hover:bg-muted/20 lg:grid-cols-[minmax(0,1fr)_7rem_9rem_11rem] lg:items-center lg:gap-6"
                  >
                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-semibold [overflow-wrap:anywhere]">
                        {product.name}
                      </h3>

                      <p className="mt-1.5 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">
                        {product.description || "No description"}
                      </p>
                    </div>

                    <p className="text-sm font-medium tabular-nums lg:text-right">
                      <span className="mr-2 font-normal text-muted-foreground lg:sr-only">
                        Price:
                      </span>
                      €{Number(product.price).toFixed(2)}
                    </p>

                    <div>
                      <span className="sr-only">Availability: </span>

                      <Badge
                        variant="secondary"
                        className={`h-auto border-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${
                            product.available
                              ? "bg-emerald-600"
                              : "bg-slate-400"
                          }`}
                        />
                        {product.available
                          ? "Available"
                          : "Unavailable"}
                      </Badge>
                    </div>

                    <div className="flex min-w-0 items-start gap-2 border-t border-border/60 pt-3 lg:justify-center lg:border-0 lg:pt-0">
                    <Link
                        href={`/dashboard/stores/${storeId}/products/${product.id}/edit`}
                        aria-label={`Edit ${product.name}`}
                        className={buttonVariants({
                        variant: "ghost",
                        className: "h-10 w-16 px-0",
                        })}
                    >
                        Edit
                    </Link>

                    <div className="w-24 shrink-0 [&_p]:break-words [&_p]:[overflow-wrap:anywhere]">
                        <RemoveProductButton productId={product.id} />
                    </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
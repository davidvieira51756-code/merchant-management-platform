import { notFound, redirect } from "next/navigation";
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
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <a
              href="/dashboard"
              className="text-sm text-muted-foreground underline"
            >
              Back to dashboard
            </a>

            <h1 className="mt-3 text-3xl font-semibold">
              {store.name}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage products for this store.
            </p>
          </div>

          <a
            href={`/dashboard/stores/${storeId}/products/new`}
            className="rounded-md bg-black px-4 py-2 text-sm text-white"
          >
            Add Product
          </a>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Products</h2>

          {products.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No products yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {product.description || "No description"}
                      </p>

                      <p className="mt-2 text-sm">
                        €{Number(product.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm">
                        {product.available
                          ? "Available"
                          : "Unavailable"}
                      </span>

                      <a
                        href={`/dashboard/stores/${storeId}/products/${product.id}/edit`}
                        className="text-sm font-medium underline"
                      >
                        Edit
                      </a>

                        <RemoveProductButton productId={product.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
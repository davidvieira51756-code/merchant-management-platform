import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";
import DeactivateStoreButton from "./deactivate-store-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: stores, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load stores");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {user.email}
            </p>
          </div>

          <LogoutButton />
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Stores</h2>

            <a
              href="/dashboard/stores/new"
              className="rounded-md bg-black px-4 py-2 text-sm text-white"
            >
              Create Store
            </a>
          </div>

          {stores.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No stores yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{store.name}</h3>

                      <p className="text-sm text-muted-foreground">
                        {store.city}, {store.state}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                    <span className="text-sm">
                        {store.active ? "Active" : "Inactive"}
                    </span>

                    <a
                        href={`/dashboard/stores/${store.id}/edit`}
                        className="text-sm font-medium underline"
                    >
                        Edit
                    </a>

                    <DeactivateStoreButton
                        storeId={store.id}
                        active={store.active}
                    />

                    <a
                        href={`/dashboard/stores/${store.id}/products`}
                        className="text-sm font-medium underline"
                      >
                        Products
                      </a>
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
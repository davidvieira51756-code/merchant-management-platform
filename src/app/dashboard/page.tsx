import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import LogoutButton from "./logout-button";
import DeactivateStoreButton from "./deactivate-store-button";

function StoreIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 10 5 3h14l2 7" />
      <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 13v8h14v-8" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

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

  const activeStores = stores.filter((store) => store.active).length;

  const stats = [
    {
      label: "Total stores",
      value: stores.length,
      dotClassName: "bg-primary",
    },
    {
      label: "Active stores",
      value: activeStores,
      dotClassName: "bg-emerald-600",
    },
    {
      label: "Inactive stores",
      value: stores.length - activeStores,
      dotClassName: "bg-slate-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <StoreIcon className="size-5" />
            </span>

            <span className="text-sm font-semibold tracking-tight">
              Merchant Platform
            </span>
          </Link>

          <div className="flex min-w-0 items-center gap-4">
            <span className="hidden max-w-64 truncate text-sm text-muted-foreground md:block">
              {user.email}
            </span>

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Manage your stores and their product catalogues.
            </p>
          </div>

          <Link
            href="/dashboard/stores/new"
            className={buttonVariants({
              className: "h-11 w-full gap-2 px-5 sm:w-auto",
            })}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            Create store
          </Link>
        </div>

        <section aria-label="Store overview" className="mt-8">
          <dl className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${stat.dotClassName}`}
                  />
                  {stat.label}
                </dt>

                <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          aria-labelledby="stores-heading"
          className="mt-8 overflow-hidden rounded-xl border bg-card shadow-sm"
        >
          <div className="border-b px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <h2
                id="stores-heading"
                className="text-lg font-semibold tracking-tight"
              >
                Your stores
              </h2>

              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium tabular-nums text-secondary-foreground">
                {stores.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage store details and browse products.
            </p>
          </div>

          {stores.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <StoreIcon className="size-8" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No stores yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Create your first store to start adding products.
              </p>

              <Link
                href="/dashboard/stores/new"
                className={buttonVariants({
                  className: "mt-6 h-11 px-5",
                })}
              >
                Create your first store
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {stores.map((store) => (
                <li
                  key={store.id}
                  className="px-5 py-5 transition-colors hover:bg-muted/30 sm:px-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground">
                        <StoreIcon className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <h3 className="break-words text-sm font-semibold [overflow-wrap:anywhere]">
                            {store.name}
                          </h3>

                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              store.active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`size-1.5 rounded-full ${
                                store.active
                                  ? "bg-emerald-600"
                                  : "bg-slate-400"
                              }`}
                            />
                            {store.active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="mt-1.5 break-words text-sm text-muted-foreground">
                          {store.city}, {store.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 lg:grid lg:grid-cols-[4rem_7.5rem_8rem]">
                      <Link
                        href={`/dashboard/stores/${store.id}/edit`}
                        aria-label={`Edit ${store.name}`}
                        className={buttonVariants({
                          variant: "ghost",
                          className: "h-10 px-4",
                        })}
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/dashboard/stores/${store.id}/products`}
                        aria-label={`View products for ${store.name}`}
                        className={buttonVariants({
                          variant: "outline",
                          className: "h-10 gap-2 px-4",
                        })}
                      >
                        Products
                        <span aria-hidden="true">→</span>
                      </Link>

                      <div
                        className={`min-h-10 w-32 items-center justify-center px-2 [&_p]:break-words ${
                          store.active ? "flex" : "hidden lg:flex"
                        }`}
                      >
                        {store.active && (
                          <DeactivateStoreButton
                            storeId={store.id}
                            active={store.active}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
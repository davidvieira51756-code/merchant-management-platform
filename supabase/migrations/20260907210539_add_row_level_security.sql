alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can view own stores"
on public.stores
for select
to authenticated
using (merchant_id = auth.uid());

create policy "Users can create own stores"
on public.stores
for insert
to authenticated
with check (merchant_id = auth.uid());

create policy "Users can update own stores"
on public.stores
for update
to authenticated
using (merchant_id = auth.uid())
with check (merchant_id = auth.uid());

create policy "Users can view products from own stores"
on public.products
for select
to authenticated
using (
  exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.merchant_id = auth.uid()
  )
);

create policy "Users can create products in own stores"
on public.products
for insert
to authenticated
with check (
  exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.merchant_id = auth.uid()
  )
);

create policy "Users can update products from own stores"
on public.products
for update
to authenticated
using (
  exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.merchant_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.merchant_id = auth.uid()
  )
);

create policy "Users can delete products from own stores"
on public.products
for delete
to authenticated
using (
  exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.merchant_id = auth.uid()
  )
);
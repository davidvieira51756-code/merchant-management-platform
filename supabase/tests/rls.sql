begin;

select plan(15);

-- Exercise policies as the same non-privileged database role used by authenticated
-- Supabase API requests. auth.uid() reads the user UUID from these JWT claims.
set local role authenticated;
set local request.jwt.claims =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

select is(
  current_user::text,
  'authenticated'::text,
  'requests run as the authenticated role, which does not bypass RLS'
);

select is(
  auth.uid(),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'Merchant A JWT claims are active'
);

select is(
  (select count(*) from public.stores),
  2::bigint,
  'Merchant A can read their own stores'
);

select is(
  (
    select count(*)
    from public.stores
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'
  ),
  0::bigint,
  'Merchant A cannot read Merchant B''s store'
);

select is(
  (select count(*) from public.products),
  3::bigint,
  'Merchant A can read products belonging to their own stores'
);

select is(
  (
    select count(*)
    from public.products
    where id = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1'
  ),
  0::bigint,
  'Merchant A cannot read products belonging to Merchant B''s store'
);

select throws_ok(
  $$
    insert into public.stores (
      merchant_id,
      name,
      street,
      city,
      state,
      zip_code,
      phone,
      timezone
    )
    values (
      '22222222-2222-4222-8222-222222222222',
      'Cross-tenant test store',
      '1 Test Street',
      'Tomar',
      'Santarem',
      '2300-999',
      '+351 249 999 999',
      'Europe/Lisbon'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "stores"',
  'Merchant A cannot insert a store for Merchant B'
);

select is_empty(
  $$
    update public.stores
    set name = 'Cross-tenant update attempt'
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'
    returning id
  $$,
  'Merchant A cannot update Merchant B''s store'
);

select is_empty(
  $$
    delete from public.products
    where id = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1'
    returning id
  $$,
  'Merchant A cannot delete Merchant B''s product'
);

select lives_ok(
  $$
    insert into public.stores (
      merchant_id,
      name,
      street,
      city,
      state,
      zip_code,
      phone,
      timezone
    )
    values (
      '11111111-1111-4111-8111-111111111111',
      'Temporary RLS test store',
      '2 Test Street',
      'Tomar',
      'Santarem',
      '2300-998',
      '+351 249 999 998',
      'Europe/Lisbon'
    )
  $$,
  'Merchant A can insert a store for themselves'
);

select isnt_empty(
  $$
    update public.stores
    set name = name || ' (verified)'
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
    returning id
  $$,
  'Merchant A can update their own store'
);

select isnt_empty(
  $$
    delete from public.products
    where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1'
    returning id
  $$,
  'Merchant A can delete a product from their own store'
);

-- Switch only the JWT identity; the database role remains authenticated.
set local request.jwt.claims =
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';

select is(
  auth.uid(),
  '22222222-2222-4222-8222-222222222222'::uuid,
  'Merchant B JWT claims are active'
);

select is(
  (select count(*) from public.stores),
  1::bigint,
  'Merchant B can still read their own store'
);

select is(
  (select count(*) from public.products),
  1::bigint,
  'Merchant B can still read the product belonging to their store'
);

select * from finish();

rollback;

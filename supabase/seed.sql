-- Test merchants used for local development and RLS testing
insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'merchant.one@example.com',
    '{"full_name":"Merchant One"}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'merchant.two@example.com',
    '{"full_name":"Merchant Two"}'::jsonb
  );

insert into public.profiles (id, full_name)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Merchant One'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Merchant Two'
  );

insert into public.stores (
  id,
  merchant_id,
  name,
  street,
  city,
  state,
  zip_code,
  phone,
  timezone,
  active
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'Downtown Store',
    '10 Main Street',
    'Tomar',
    'Santarém',
    '2300-000',
    '+351 249 000 001',
    'Europe/Lisbon',
    true
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111',
    'Riverside Store',
    '25 River Street',
    'Tomar',
    'Santarém',
    '2300-001',
    '+351 249 000 002',
    'Europe/Lisbon',
    true
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '22222222-2222-4222-8222-222222222222',
    'Central Market',
    '42 Market Avenue',
    'Leiria',
    'Leiria',
    '2400-000',
    '+351 244 000 001',
    'Europe/Lisbon',
    true
  );

insert into public.products (
  id,
  store_id,
  name,
  description,
  price,
  available
)
values
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'Classic T-Shirt',
    'Basic cotton t-shirt',
    19.99,
    true
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'Canvas Backpack',
    'Everyday canvas backpack',
    39.90,
    true
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'Water Bottle',
    'Reusable stainless steel bottle',
    14.50,
    true
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd1',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'Notebook',
    'Hardcover notebook',
    8.99,
    true
  );
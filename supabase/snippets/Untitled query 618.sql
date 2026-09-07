begin;

set local role authenticated;
set local "request.jwt.claims" =
'{
  "sub": "11111111-1111-4111-8111-111111111111",
  "role": "authenticated"
}';

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
  'Illegal Store',
  'Test Street',
  'Tomar',
  'Santarém',
  '2300-000',
  '+351 249 000 999',
  'Europe/Lisbon'
);

rollback;
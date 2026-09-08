alter table public.stores
add constraint stores_name_not_blank
check (char_length(trim(name)) > 0);

alter table public.stores
add constraint stores_street_not_blank
check (char_length(trim(street)) > 0);

alter table public.stores
add constraint stores_city_not_blank
check (char_length(trim(city)) > 0);

alter table public.stores
add constraint stores_state_not_blank
check (char_length(trim(state)) > 0);

alter table public.stores
add constraint stores_zip_code_not_blank
check (char_length(trim(zip_code)) > 0);

alter table public.stores
add constraint stores_phone_not_blank
check (char_length(trim(phone)) > 0);

alter table public.stores
add constraint stores_timezone_not_blank
check (char_length(trim(timezone)) > 0);

alter table public.products
add constraint products_name_not_blank
check (char_length(trim(name)) > 0);
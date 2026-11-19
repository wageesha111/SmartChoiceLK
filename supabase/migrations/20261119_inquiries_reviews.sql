-- Customer messages from the contact form, and product reviews that wait for admin approval.

create table if not exists public.shop_inquiries (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 6 and 30),
  topic text check (char_length(topic) <= 80),
  town text check (char_length(town) <= 80),
  message text check (char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new', 'read', 'done')),
  created_at timestamptz not null default now()
);

alter table public.shop_inquiries enable row level security;

create policy "anyone can send a message" on public.shop_inquiries
  for insert to anon, authenticated with check (status = 'new');
create policy "admins read messages" on public.shop_inquiries
  for select to authenticated using (public.is_shop_admin());
create policy "admins update messages" on public.shop_inquiries
  for update to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());
create policy "admins delete messages" on public.shop_inquiries
  for delete to authenticated using (public.is_shop_admin());

create table if not exists public.shop_reviews (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.shop_products(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 1500),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists shop_reviews_product_idx on public.shop_reviews (product_id) where approved;

alter table public.shop_reviews enable row level security;

create policy "anyone can submit a review for approval" on public.shop_reviews
  for insert to anon, authenticated with check (approved = false);
create policy "public reads approved reviews" on public.shop_reviews
  for select to anon, authenticated using (approved or public.is_shop_admin());
create policy "admins update reviews" on public.shop_reviews
  for update to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());
create policy "admins delete reviews" on public.shop_reviews
  for delete to authenticated using (public.is_shop_admin());

grant insert on public.shop_inquiries to anon, authenticated;
grant select, update, delete on public.shop_inquiries to authenticated;
grant insert, select on public.shop_reviews to anon, authenticated;
grant update, delete on public.shop_reviews to authenticated;

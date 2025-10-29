-- Enable extensions required for text search and UUID generation.
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Drop legacy tables that conflict with the new ecommerce schema.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'tracker_snapshots') then
    execute 'drop table public.tracker_snapshots cascade';
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') then
    execute 'drop table public.profiles cascade';
  end if;
end $$;

-- Enumerated types.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'admin');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('pending', 'paid', 'failed', 'cancelled', 'fulfilled');
  end if;
end $$;

-- Utility functions for identity mapping.
create or replace function public.current_user_external_id()
returns text
language plpgsql
stable
as $$
declare
  _ext text;
  _tmp text;
  _uid uuid;
begin
  begin
    _uid := auth.uid();
  exception when others then
    _uid := null;
  end;
  if _uid is not null then
    return _uid::text;
  end if;

  begin
    _tmp := current_setting('request.jwt.claim.sub', true);
  exception when others then
    _tmp := null;
  end;
  if _tmp is not null and length(_tmp) > 0 then
    return _tmp;
  end if;

  begin
    _ext := current_setting('request.jwt.claims.external_id', true);
  exception when others then
    _ext := null;
  end;
  return nullif(_ext, '');
end;
$$;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select id
  from public.profiles
  where external_id = public.current_user_external_id();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.external_id = public.current_user_external_id()
      and p.role = 'admin'
  );
$$;

comment on function public.current_user_external_id is 'Resolve the current request''s stable external identifier from Supabase Auth or an upstream OIDC provider.';
comment on function public.current_profile_id is 'Fetch the profile UUID for the active subject (returns null if not provisioned).';
comment on function public.is_admin is 'True when the current subject is associated with an admin profile.';

-- Profiles table aligned with Authelia OIDC identities.
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  email text,
  display_name text,
  avatar_url text,
  bio text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_external_id_idx on public.profiles (external_id);
create index if not exists profiles_email_lower_idx on public.profiles (lower(email));

-- Publishers and platforms.
create table if not exists public.publishers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

-- Games core catalog.
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price_in_cents integer not null check (price_in_cents >= 0),
  release_date date,
  publisher_id uuid references public.publishers(id) on delete set null,
  rating_avg numeric(4,2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists games_title_idx on public.games using gin (to_tsvector('simple', coalesce(title, '')));
create index if not exists games_slug_idx on public.games (slug);
create index if not exists games_title_trgm_idx on public.games using gin (title gin_trgm_ops);

-- Join tables.
create table if not exists public.game_platforms (
  game_id uuid references public.games(id) on delete cascade,
  platform_id uuid references public.platforms(id) on delete cascade,
  primary key (game_id, platform_id)
);

create table if not exists public.game_categories (
  game_id uuid references public.games(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (game_id, category_id)
);

-- Inventory
create table if not exists public.inventory (
  game_id uuid primary key references public.games(id) on delete cascade,
  stock integer not null check (stock >= 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

-- Carts and cart items
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete set null default public.current_profile_id(),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete restrict,
  qty integer not null check (qty > 0),
  unit_price_in_cents integer not null check (unit_price_in_cents >= 0),
  inserted_at timestamptz not null default timezone('utc', now()),
  unique (cart_id, game_id)
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.order_status not null default 'pending',
  total_in_cents integer not null check (total_in_cents >= 0),
  payment_ref text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete restrict,
  qty integer not null check (qty > 0),
  unit_price_in_cents integer not null check (unit_price_in_cents >= 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- Reviews & wishlists
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (game_id, user_id)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, game_id)
);

-- Ensure inventory update timestamp stays fresh.
create or replace function public.touch_inventory_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create trigger inventory_set_updated
before update on public.inventory
for each row execute function public.touch_inventory_updated_at();

-- Insert bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', false)
on conflict (id) do update set public = excluded.public;

-- Storage policies ensure only admins or the service role can manipulate product assets directly.
alter table if exists storage.objects enable row level security;

create policy if not exists "Admins manage product images" on storage.objects
  for all
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy if not exists "Service role manages product images" on storage.objects
  for all
  using (bucket_id = 'product-images' and auth.role() = 'service_role')
  with check (bucket_id = 'product-images' and auth.role() = 'service_role');

-- RLS enablement.
alter table public.profiles enable row level security;
alter table public.publishers enable row level security;
alter table public.platforms enable row level security;
alter table public.categories enable row level security;
alter table public.games enable row level security;
alter table public.game_platforms enable row level security;
alter table public.game_categories enable row level security;
alter table public.inventory enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;

-- Policy: admins have full visibility of profiles to support moderation flows.
create policy if not exists "Admin can read profiles" on public.profiles
  for select
  using (public.is_admin());

-- Policy: individual users may read their own profile row using the Authelia/Supabase subject mapping.
create policy if not exists "Users can read own profile" on public.profiles
  for select
  using (external_id = public.current_user_external_id());

-- Policy: users may update only their own profile metadata.
create policy if not exists "Users update own profile" on public.profiles
  for update
  using (external_id = public.current_user_external_id())
  with check (external_id = public.current_user_external_id());

-- Policy: the service role (used by provisioning scripts) can manage any profile.
create policy if not exists "Service role manages profiles" on public.profiles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Policy: catalog data is publicly readable to power the storefront.
create policy if not exists "Public can read catalog" on public.games for select using (true);
create policy if not exists "Public can read publishers" on public.publishers for select using (true);
create policy if not exists "Public can read platforms" on public.platforms for select using (true);
create policy if not exists "Public can read categories" on public.categories for select using (true);
create policy if not exists "Public can read inventory" on public.inventory for select using (true);

-- Policy: only admins can mutate catalog metadata.
create policy if not exists "Admin manages games" on public.games for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "Admin manages publishers" on public.publishers for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "Admin manages platforms" on public.platforms for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "Admin manages categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "Admin manages inventory" on public.inventory for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "Admin manages game platforms" on public.game_platforms for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "Admin manages game categories" on public.game_categories for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "Public can read game platforms" on public.game_platforms for select using (true);
create policy if not exists "Public can read game categories" on public.game_categories for select using (true);

-- Policy: shoppers may only view the cart associated with their subject mapping.
create policy if not exists "Users own their cart" on public.carts
  for select
  using (user_id = public.current_profile_id());

-- Policy: shoppers can create or attach to a cart linked to their identity.
create policy if not exists "Users insert their cart" on public.carts
  for insert
  with check (coalesce(user_id, public.current_profile_id()) = public.current_profile_id());

-- Policy: shoppers may update their own cart contents.
create policy if not exists "Users update their cart" on public.carts
  for update
  using (user_id = public.current_profile_id())
  with check (user_id = public.current_profile_id());

-- Policy: shoppers can discard their cart explicitly.
create policy if not exists "Users delete their cart" on public.carts
  for delete
  using (user_id = public.current_profile_id());

-- Policy: cart items inherit ownership from their parent cart.
create policy if not exists "Users manage their cart items" on public.cart_items
  for all
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = public.current_profile_id()))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = public.current_profile_id()));

-- Policy: shoppers can see their past orders.
create policy if not exists "Users read their orders" on public.orders
  for select
  using (user_id = public.current_profile_id());

-- Policy: orders may only be created for the authenticated user.
create policy if not exists "Users manage their orders" on public.orders
  for insert
  with check (user_id = public.current_profile_id());

-- Policy: payment processors (service role) or admins may update order state.
create policy if not exists "Service role updates orders" on public.orders
  for update
  using (auth.role() = 'service_role' or public.is_admin())
  with check (auth.role() = 'service_role' or public.is_admin());

-- Policy: shoppers can read their own order line items.
create policy if not exists "Users read their order items" on public.order_items
  for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = public.current_profile_id()));

-- Policy: order line item inserts must map back to the owner order (used by checkout edge function).
create policy if not exists "Users manage their order items" on public.order_items
  for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = public.current_profile_id()));

-- Policy: trusted automation (service role or admins) can patch order items when reconciling payments.
create policy if not exists "Service role updates order items" on public.order_items
  for all
  using (auth.role() = 'service_role' or public.is_admin())
  with check (auth.role() = 'service_role' or public.is_admin());

-- Policy: reviewers manage only their own ratings content.
create policy if not exists "Users manage reviews" on public.reviews
  for all
  using (user_id = public.current_profile_id())
  with check (user_id = public.current_profile_id());

-- Policy: wishlists are private to each user.
create policy if not exists "Users manage wishlists" on public.wishlists
  for all
  using (user_id = public.current_profile_id())
  with check (user_id = public.current_profile_id());

-- Policy: reviews can be displayed publicly alongside game pages.
create policy if not exists "Public can read reviews" on public.reviews
  for select
  using (true);

-- Policy: wishlist visibility is restricted to the owner even for reads.
create policy if not exists "Public can read wishlists when owner" on public.wishlists
  for select
  using (user_id = public.current_profile_id());

-- Ensure default timestamps update
create or replace function public.touch_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated
before update on public.profiles
for each row execute function public.touch_profile_updated_at();

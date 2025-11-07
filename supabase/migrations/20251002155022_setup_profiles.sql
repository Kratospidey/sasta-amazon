-- Profiles store metadata for authenticated Supabase users.
create table if not exists public.profiles (
  id text primary key,
  email text,
  display_name text,
  avatar_color text,
  bio text,
  privacy text not null default 'friends',
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_email_idx on public.profiles (lower(email));

-- Tracker snapshots persist the most recent game vault state per user.
create table if not exists public.tracker_snapshots (
  user_id text primary key references public.profiles(id) on delete cascade,
  snapshot jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is 'Profile metadata for users authenticated via Supabase.';
comment on table public.tracker_snapshots is 'Latest synced tracker data for each profile.';

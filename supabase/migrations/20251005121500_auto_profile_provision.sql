-- Automatically provision a public.profiles row whenever a Supabase auth user is created.
create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _display_name text;
begin
  _display_name := coalesce(new.raw_user_meta_data->>'display_name', new.email, 'Player');

  insert into public.profiles (external_id, email, display_name, avatar_url, bio)
  values (new.id::text, new.email, _display_name, null, '')
  on conflict (external_id) do update
    set email = excluded.email,
        display_name = coalesce(nullif(excluded.display_name, ''), public.profiles.display_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists handle_new_auth_user_profile on auth.users;
create trigger handle_new_auth_user_profile
  after insert on auth.users
  for each row execute function public.handle_new_auth_user_profile();

comment on function public.handle_new_auth_user_profile is 'Ensure each Supabase auth user has a corresponding public.profiles row.';

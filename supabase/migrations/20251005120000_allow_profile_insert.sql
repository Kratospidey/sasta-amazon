-- Allow authenticated users to provision their own profile record.
create policy "Users insert own profile" on public.profiles
  for insert
  with check (external_id = public.current_user_external_id());

import { getSupabaseClient } from './supabaseClient';
import type { Profile } from './types';
import { asString, isRecord } from './utils';

function mapProfile(row: unknown): Profile {
  if (!isRecord(row)) {
    throw new TypeError('Invalid profile payload');
  }
  return {
    id: asString(row.id) ?? '',
    externalId: asString(row.external_id) ?? '',
    email: asString(row.email),
    displayName: asString(row.display_name),
    avatarUrl: asString(row.avatar_url),
    bio: asString(row.bio),
    role: (row.role as Profile['role']) ?? 'user',
    createdAt: asString(row.created_at) ?? new Date().toISOString(),
    updatedAt: asString(row.updated_at) ?? new Date().toISOString(),
  };
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, external_id, email, display_name, avatar_url, bio, role, created_at, updated_at')
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapProfile(data) : null;
}

export async function updateMyProfile(update: Partial<Pick<Profile, 'displayName' | 'avatarUrl' | 'bio'>>): Promise<Profile> {
  const supabase = getSupabaseClient();
  const payload = {
    display_name: update.displayName,
    avatar_url: update.avatarUrl,
    bio: update.bio,
  };
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .select('id, external_id, email, display_name, avatar_url, bio, role, created_at, updated_at')
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    throw new Error('Profile update did not return a record');
  }
  return mapProfile(data);
}

import { createServiceClient } from "./supabase.ts";

export interface ProfileRecord {
  id: string;
  external_id: string;
  role: 'user' | 'admin';
  display_name: string | null;
  email: string | null;
}

export async function fetchProfileByExternalId(externalId: string): Promise<ProfileRecord | null> {
  const client = createServiceClient();
  const { data, error } = await client
    .from('profiles')
    .select('id, external_id, role, display_name, email')
    .eq('external_id', externalId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data as ProfileRecord | null;
}

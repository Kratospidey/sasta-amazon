import { fetchProfileByExternalId } from "./profile.ts";
import { errorResponse } from "./responses.ts";

export async function requireProfile(externalId: string) {
  const profile = await fetchProfileByExternalId(externalId);
  if (!profile) {
    throw errorResponse('profile_not_found', 'Provision a profile before calling this endpoint.', 403);
  }
  return profile;
}

export async function requireAdmin(externalId: string) {
  const profile = await requireProfile(externalId);
  if (profile.role !== 'admin') {
    throw errorResponse('forbidden', 'Admin privileges required.', 403);
  }
  return profile;
}

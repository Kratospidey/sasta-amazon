interface JwtPayload {
  sub?: string;
  role?: string;
  app_metadata?: { role?: string };
  [key: string]: unknown;
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return payload as JwtPayload;
  } catch (error) {
    console.warn('Failed to decode JWT', error);
    return null;
  }
}

export function isAdminFromToken(token: string | null): boolean {
  const payload = decodeJwt(token);
  const role = payload?.role ?? payload?.app_metadata?.role ?? (payload?.['https://claims.sasta-amazon.app/role'] as string | undefined);
  return role === 'admin';
}

export function externalIdFromToken(token: string | null): string | null {
  const payload = decodeJwt(token);
  if (!payload) return null;
  const externalId = payload.sub ?? (payload['external_id'] as string | undefined);
  return externalId ?? null;
}

export interface JwtPayload {
  sub?: string;
  [key: string]: unknown;
}

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/Bearer\s+(.*)/i);
  return match ? match[1] : null;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return JSON.parse(decoded);
  } catch (_err) {
    return null;
  }
}

export function requireSubject(request: Request): string {
  const token = getBearerToken(request);
  if (!token) {
    throw new Error("Missing bearer token");
  }
  const payload = decodeJwt(token);
  const extraExternal = payload && typeof (payload as Record<string, unknown>)["external_id"] === "string"
    ? (payload as Record<string, string>)["external_id"]
    : undefined;
  const subject = payload?.sub ?? extraExternal;
  if (!subject) {
    throw new Error("JWT payload missing subject");
  }
  return subject;
}

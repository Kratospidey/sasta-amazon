export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const SUPABASE_URL = requireEnv("SUPABASE_URL");
export const SUPABASE_ANON_KEY = requireEnv("SUPABASE_ANON_KEY");
export const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
export const SUPABASE_DB_URL = Deno.env.get("SUPABASE_DB_URL") ?? Deno.env.get("DATABASE_URL") ?? (() => {
  throw new Error("Missing SUPABASE_DB_URL or DATABASE_URL for transactional queries.");
})();

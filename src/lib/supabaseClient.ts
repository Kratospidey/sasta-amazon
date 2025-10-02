import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
} else if (import.meta.env.DEV) {
  console.warn(
    "Supabase client is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable database syncing.",
  );
}

export const supabase = client;
export const isSupabaseConfigured = client !== null;

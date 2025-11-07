import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getSupabaseClient } from "@/lib/api/supabaseClient";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email: string;
  password?: string; // only used in local mode
  displayName: string;
  avatarColor: string;
  bio: string;
  privacy: "public" | "friends" | "private";
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  users: AuthUser[]; // mostly used in local demo mode
  login: (email?: string, password?: string) => Promise<void>;
  register: (input?: {
    email?: string;
    password?: string;
    displayName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<AuthUser> & { password?: string }
  ) => Promise<void>;
  // kept for API compatibility; no-ops in Supabase/local modes
  beginLogin: (options?: { redirectTo?: string }) => Promise<void>;
  completeLogin: (params: URLSearchParams) => Promise<void>;
  usingAuthelia: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultUser: AuthUser = {
  id: "demo-user",
  email: "demo@gamevault.dev",
  password: "demo",
  displayName: "Demo Player",
  avatarColor: "from-primary to-accent",
  bio: "Exploring galaxies and cataloguing achievements since 2024.",
  privacy: "public",
};

const isBrowser = typeof window !== "undefined";

/* -------------------------------------------------------------------------- */
/*                         Supabase-backed auth provider                      */
/* -------------------------------------------------------------------------- */

function mapProfileToAuthUser(profile: any, fallbackEmail: string): AuthUser {
  return {
    id: profile?.id ?? "unknown-profile",
    email: profile?.email ?? fallbackEmail,
    displayName:
      profile?.display_name ?? profile?.email ?? fallbackEmail ?? "Player",
    avatarColor: "from-secondary to-primary",
    bio: profile?.bio ?? "",
    privacy: "friends",
  };
}

async function ensureProfileForUser(
  supabase: SupabaseClient,
  opts: { userId: string; email: string; displayName?: string }
) {
  const profileSelection =
    "id, external_id, email, display_name, avatar_url, bio, role, created_at, updated_at";

  // RLS + unique(external_id) guarantees at most one row visible
  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelection)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (data) return data;

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert({
      external_id: opts.userId,
      email: opts.email,
      display_name: opts.displayName ?? opts.email ?? "Player",
      avatar_url: null,
      bio: "",
    })
    .select(profileSelection)
    .single();

  if (insertError) {
    // A trigger might have already provisioned the profile; re-fetch instead of failing hard.
    if (insertError.code === "23505") {
      const { data: existing, error: existingError } = await supabase
        .from("profiles")
        .select(profileSelection)
        .maybeSingle();

      if (existingError && existingError.code !== "PGRST116") {
        throw existingError;
      }

      if (existing) return existing;
    }

    throw insertError;
  }

  return inserted;
}

const SupabaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState<SupabaseClient | null>(() => {
    try {
      return getSupabaseClient();
    } catch {
      return null;
    }
  });

  // Initial load + subscribe to auth state changes
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const init = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        const authUser = data.user;

        if (!authUser) {
          if (!cancelled) setUser(null);
          return;
        }

        const profile = await ensureProfileForUser(supabase, {
          userId: authUser.id,
          email: authUser.email ?? "",
        });

        if (!cancelled) {
          setUser(
            mapProfileToAuthUser(profile, authUser.email ?? "player@example.com")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user;
        if (!authUser) {
          setUser(null);
          return;
        }

        const profile = await ensureProfileForUser(supabase, {
          userId: authUser.id,
          email: authUser.email ?? "",
        });

        setUser(
          mapProfileToAuthUser(profile, authUser.email ?? "player@example.com")
        );
      }
    );

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const register = useCallback<
    AuthContextValue["register"]
  >(async ({ email, password, displayName } = {}) => {
    if (!supabase) {
      throw new Error("Supabase client is not configured");
    }
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const redirectOverride = import.meta.env.VITE_AUTHELIA_REDIRECT_URI;
    const emailRedirectTo = isBrowser
      ? redirectOverride && redirectOverride.startsWith("http")
        ? redirectOverride
        : `${window.location.origin}${redirectOverride ?? "/auth/callback"}`
      : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName ?? email,
        },
        emailRedirectTo,
      },
    });
    if (error) throw error;
    const authUser = data.user;
    if (!authUser) return;

    // When email confirmations are enabled the session is null until the user verifies their email.
    if (!data.session) {
      return;
    }

    const profile = await ensureProfileForUser(supabase, {
      userId: authUser.id,
      email: authUser.email ?? email,
      displayName,
    });

    setUser(
      mapProfileToAuthUser(profile, authUser.email ?? "player@example.com")
    );
  }, [supabase]);

  const login = useCallback<AuthContextValue["login"]>(
    async (email, password) => {
      if (!supabase) {
        throw new Error("Supabase client is not configured");
      }
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const authUser = data.user;
      if (!authUser) {
        setUser(null);
        return;
      }

      const profile = await ensureProfileForUser(supabase, {
        userId: authUser.id,
        email: authUser.email ?? email,
      });

      setUser(
        mapProfileToAuthUser(profile, authUser.email ?? "player@example.com")
      );
    },
    [supabase]
  );

  const logout = useCallback<AuthContextValue["logout"]>(async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const updateProfile = useCallback<
    AuthContextValue["updateProfile"]
  >(async (updates) => {
    if (!supabase || !user) return;

    const payload: Record<string, unknown> = {
      display_name: updates.displayName ?? user.displayName,
      bio: updates.bio ?? user.bio,
      // avatar_url: could be wired later
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .select(
        "id, external_id, email, display_name, avatar_url, bio, role, created_at, updated_at"
      )
      .maybeSingle();

    if (error) throw error;
    if (!data) return;

    setUser(
      mapProfileToAuthUser(
        data,
        updates.email ?? user.email ?? "player@example.com"
      )
    );
  }, [supabase, user]);

  const beginLogin = useCallback<AuthContextValue["beginLogin"]>(
    async () => {
      // no-op in Supabase password mode (we use inline dialog)
      return;
    },
    []
  );

  const completeLogin = useCallback<AuthContextValue["completeLogin"]>(
    async () => {
      // no-op; we don't use redirect-based OIDC here
      return;
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      users: user ? [user] : [],
      login,
      register,
      logout,
      updateProfile,
      beginLogin,
      completeLogin,
      usingAuthelia: false,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      beginLogin,
      completeLogin,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                     Local-only demo auth (existing behaviour)              */
/* -------------------------------------------------------------------------- */

const USERS_KEY = "gamevault-tracker-users";
const SESSION_KEY = "gamevault-tracker-session";

const loadUsers = (): AuthUser[] => {
  if (!isBrowser) {
    return [defaultUser];
  }
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
    return [defaultUser];
  }
  try {
    const parsed = JSON.parse(raw) as AuthUser[];
    if (!parsed.length) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return parsed;
  } catch {
    window.localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
    return [defaultUser];
  }
};

const persistUsers = (users: AuthUser[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 11)}`;

const LocalAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsers = loadUsers();
    setUsers(storedUsers);
    const sessionId = isBrowser ? window.localStorage.getItem(SESSION_KEY) : null;
    if (sessionId) {
      const existing = storedUsers.find((u) => u.id === sessionId);
      setUser(existing ?? null);
    }
    setLoading(false);
  }, []);

  const register = useCallback<
    AuthContextValue["register"]
  >(async ({ email, password, displayName } = {}) => {
    if (!email || !password || !displayName) {
      throw new Error("Email, password and display name are required");
    }
    setUsers((prev) => {
      if (prev.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with that email already exists");
      }
      const newUser: AuthUser = {
        id: `user-${createId()}`,
        email,
        password,
        displayName,
        avatarColor: "from-secondary to-primary",
        bio: "",
        privacy: "friends",
      };
      const next = [...prev, newUser];
      persistUsers(next);
      if (isBrowser) {
        window.localStorage.setItem(SESSION_KEY, newUser.id);
      }
      setUser(newUser);
      return next;
    });
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    async (email, password) => {
      const match = users.find(
        (u) =>
          u.email.toLowerCase() === (email ?? "").toLowerCase() &&
          u.password === password
      );
      if (!match) {
        throw new Error("Invalid credentials");
      }
      if (isBrowser) {
        window.localStorage.setItem(SESSION_KEY, match.id);
      }
      setUser(match);
    },
    [users]
  );

  const logout = useCallback<AuthContextValue["logout"]>(async () => {
    if (isBrowser) {
      window.localStorage.removeItem(SESSION_KEY);
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback<
    AuthContextValue["updateProfile"]
  >(async (updates) => {
    if (!user) return;
    setUsers((prev) => {
      const next = prev.map((u) => {
        if (u.id !== user.id) return u;
        const updated: AuthUser = {
          ...u,
          ...updates,
          password: updates.password ?? u.password,
        };
        setUser(updated);
        return updated;
      });
      persistUsers(next);
      return next;
    });
  }, [user]);

  const beginLogin = useCallback<AuthContextValue["beginLogin"]>(
    async () => {
      return;
    },
    []
  );

  const completeLogin = useCallback<AuthContextValue["completeLogin"]>(
    async () => {
      return;
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      users,
      login,
      register,
      logout,
      updateProfile,
      beginLogin,
      completeLogin,
      usingAuthelia: false,
    }),
    [
      user,
      loading,
      users,
      login,
      register,
      logout,
      updateProfile,
      beginLogin,
      completeLogin,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // If Supabase is configured, prefer Supabase Auth.
  const hasSupabaseEnv =
    !!import.meta.env.VITE_SUPABASE_URL &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (hasSupabaseEnv) {
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
  }

  // Fallback: purely local demo auth
  return <LocalAuthProvider>{children}</LocalAuthProvider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

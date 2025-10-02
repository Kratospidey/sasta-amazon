import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { autheliaClient, isAutheliaConfigured } from "@/lib/autheliaClient";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export type AuthUser = {
  id: string;
  email: string;
  password?: string;
  displayName: string;
  avatarColor: string;
  bio: string;
  privacy: "public" | "friends" | "private";
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  users: AuthUser[];
  login: (email?: string, password?: string) => Promise<void>;
  register: (input?: { email?: string; password?: string; displayName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<Omit<AuthUser, "id" | "email" | "password">> & { password?: string },
  ) => Promise<void>;
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

const TOKENS_KEY = "gamevault-authelia-session";
const CHALLENGE_KEY = "gamevault-authelia-challenge";

const isBrowser = typeof window !== "undefined";

type StoredTokens = {
  access: string;
  refresh: string;
  idToken?: string;
  expiresAt: number;
};

type TokenPayload = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

const decodeToken = (token?: string): TokenPayload | null => {
  try {
    if (!token) return null;
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalised = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalised.padEnd(normalised.length + ((4 - (normalised.length % 4)) % 4), "=");
    const decoded = isBrowser ? window.atob(padded) : Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(decoded) as TokenPayload;
  } catch (error) {
    console.error("Failed to decode access token", error);
    return null;
  }
};

const getStoredTokens = (): StoredTokens | null => {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(TOKENS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredTokens;
    if (!parsed.access || !parsed.refresh || !parsed.expiresAt) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse stored tokens", error);
    return null;
  }
};

const persistTokens = (tokens: StoredTokens | null) => {
  if (!isBrowser) return;
  if (!tokens) {
    window.localStorage.removeItem(TOKENS_KEY);
    return;
  }
  window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
};

const storeChallenge = (challenge: unknown) => {
  if (!isBrowser) return;
  window.sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
};

const readChallenge = (): { state: string; verifier?: string; redirectURI?: string } | null => {
  if (!isBrowser) return null;
  const raw = window.sessionStorage.getItem(CHALLENGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { state: string; verifier?: string; redirectURI?: string };
  } catch (error) {
    console.error("Failed to parse stored challenge", error);
    return null;
  }
};

const clearChallenge = () => {
  if (!isBrowser) return;
  window.sessionStorage.removeItem(CHALLENGE_KEY);
};

const getDefaultRedirectURI = () => {
  if (!isBrowser) return "";
  return (
    (import.meta.env.VITE_AUTHELIA_REDIRECT_URI as string | undefined) ??
    `${window.location.origin}/auth/callback`
  );
};

const formatProfile = (profile: {
  id: string;
  email?: string | null;
  display_name?: string | null;
  avatar_color?: string | null;
  bio?: string | null;
  privacy?: string | null;
}): AuthUser => ({
  id: profile.id,
  email: profile.email ?? "",
  displayName: profile.display_name ?? profile.email ?? "Player",
  avatarColor: profile.avatar_color ?? "from-secondary to-primary",
  bio: profile.bio ?? "",
  privacy: (profile.privacy as AuthUser["privacy"]) ?? "friends",
});

const RemoteAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<StoredTokens | null>(() => getStoredTokens());
  const [loading, setLoading] = useState(true);

  const loadProfileFromTokens = useCallback(
    async (session: StoredTokens | null) => {
      if (!session) {
        setUser(null);
        return;
      }
      if (!supabase || !autheliaClient) {
        setUser(null);
        return;
      }
      const payload = decodeToken(session.idToken ?? session.access);
      if (!payload?.sub) {
        console.warn("Missing subject in Authelia token");
        setUser(null);
        return;
      }
      const identifier = payload.sub;
      const email = payload.email ?? "";
      const fallbackDisplay = payload.name ?? (email ? email.split("@")[0] : "Explorer");
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id,email,display_name,avatar_color,bio,privacy")
          .eq("id", identifier)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (!data) {
          const { data: created, error: insertError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: identifier,
                email,
                display_name: fallbackDisplay,
                avatar_color: "from-secondary to-primary",
                bio: "",
                privacy: "friends",
              },
              { onConflict: "id" },
            )
            .select("id,email,display_name,avatar_color,bio,privacy")
            .single();

          if (insertError) {
            throw insertError;
          }

          setUser(formatProfile(created));
          return;
        }

        setUser(formatProfile(data));
      } catch (error) {
        console.error("Failed to load profile from Supabase", error);
        setUser(null);
      }
    },
    [supabase, autheliaClient],
  );

  useEffect(() => {
    let cancelled = false;
    const initialise = async () => {
      setLoading(true);
      try {
        await loadProfileFromTokens(tokens);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void initialise();
    return () => {
      cancelled = true;
    };
  }, [tokens, loadProfileFromTokens]);

  const logout = useCallback(async () => {
    setTokens(null);
    persistTokens(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!tokens || !autheliaClient || !isBrowser) return;
    const timeout = window.setTimeout(async () => {
      try {
        const refreshed = await autheliaClient.refresh(tokens.refresh);
        const next: StoredTokens = {
          access: refreshed.access,
          refresh: refreshed.refresh,
          idToken: refreshed.idToken ?? tokens.idToken,
          expiresAt: Date.now() + refreshed.expiresIn * 1000,
        };
        setTokens(next);
        persistTokens(next);
      } catch (error) {
        console.error("Failed to refresh Authelia session", error);
        await logout();
      }
    }, Math.max(tokens.expiresAt - Date.now() - 60_000, 5_000));

    return () => window.clearTimeout(timeout);
  }, [tokens, logout]);

  useEffect(() => {
    persistTokens(tokens);
  }, [tokens]);

  const beginLogin = useCallback<AuthContextValue["beginLogin"]>(async (options) => {
    if (!autheliaClient) {
      throw new Error("Authelia client is not configured");
    }
    if (!isBrowser) return;
    const redirectURI = options?.redirectTo ?? getDefaultRedirectURI();
    const { challenge, url } = await autheliaClient.authorize(redirectURI);
    storeChallenge({ ...challenge, redirectURI });
    window.location.href = url;
  }, [autheliaClient]);

  const completeLogin = useCallback<AuthContextValue["completeLogin"]>(async (params) => {
    if (!autheliaClient) {
      throw new Error("Authelia client is not configured");
    }
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state) {
      throw new Error("Missing authorization response parameters");
    }
    const stored = readChallenge();
    if (!stored) {
      throw new Error("Sign-in session has expired. Start the flow again.");
    }
    if (stored.state !== state) {
      throw new Error("Authorization state mismatch");
    }
    const redirectURI = stored.redirectURI ?? getDefaultRedirectURI();
    const exchanged = await autheliaClient.exchange(code, redirectURI, stored.verifier);
    const session: StoredTokens = {
      access: exchanged.access,
      refresh: exchanged.refresh,
      idToken: exchanged.idToken,
      expiresAt: Date.now() + exchanged.expiresIn * 1000,
    };
    clearChallenge();
    setTokens(session);
    persistTokens(session);
  }, [autheliaClient]);

  const login = useCallback<AuthContextValue["login"]>(async () => {
    await beginLogin();
  }, [beginLogin]);

  const register = useCallback<AuthContextValue["register"]>(async () => {
    await beginLogin();
  }, [beginLogin]);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    async (updates) => {
      if (!supabase) {
        throw new Error("Supabase client is not configured");
      }
      if (!user) return;
      const payload = {
        display_name: updates.displayName ?? user.displayName,
        avatar_color: updates.avatarColor ?? user.avatarColor,
        bio: updates.bio ?? user.bio,
        privacy: updates.privacy ?? user.privacy,
      };
      const { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id)
        .select("id,email,display_name,avatar_color,bio,privacy")
        .single();
      if (error) {
        throw error;
      }
      setUser(formatProfile(data));
    },
    [user, supabase],
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
      usingAuthelia: true,
    }),
    [user, loading, login, register, logout, updateProfile, beginLogin, completeLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const USERS_KEY = "gamevault-tracker-users";
const SESSION_KEY = "gamevault-tracker-session";

type LocalAuthProviderProps = {
  children: React.ReactNode;
};

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
  } catch (error) {
    console.error("Failed to parse stored users", error);
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

const LocalAuthProvider = ({ children }: LocalAuthProviderProps) => {
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

  const register = useCallback<Required<AuthContextValue>["register"]>(
    async ({ email, password, displayName } = {}) => {
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
    },
    [],
  );

  const login = useCallback<Required<AuthContextValue>["login"]>(async (email, password) => {
    const match = users.find(
      (u) => u.email.toLowerCase() === (email ?? "").toLowerCase() && u.password === password,
    );
    if (!match) {
      throw new Error("Invalid credentials");
    }
    if (isBrowser) {
      window.localStorage.setItem(SESSION_KEY, match.id);
    }
    setUser(match);
  }, [users]);

  const logout = useCallback(async () => {
    if (isBrowser) {
      window.localStorage.removeItem(SESSION_KEY);
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    async (updates) => {
      if (!user) return;
      setUsers((prev) => {
        const next = prev.map((u) => {
          if (u.id !== user.id) return u;
          const updated = {
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
    },
    [user],
  );

  const beginLogin = useCallback<AuthContextValue["beginLogin"]>(async () => {
    // Local mode simply presents the inline login form.
    return;
  }, []);

  const completeLogin = useCallback<AuthContextValue["completeLogin"]>(async () => {
    return;
  }, []);

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
    [user, loading, users, login, register, logout, updateProfile, beginLogin, completeLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  if (isSupabaseConfigured && isAutheliaConfigured) {
    return <RemoteAuthProvider>{children}</RemoteAuthProvider>;
  }
  return <LocalAuthProvider>{children}</LocalAuthProvider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

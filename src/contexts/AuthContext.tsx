import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  password: string;
  displayName: string;
  avatarColor: string;
  bio: string;
  privacy: "public" | "friends" | "private";
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  users: AuthUser[];
  register: (input: { email: string; password: string; displayName: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<AuthUser, "id" | "email" | "password">> & { password?: string }) => Promise<void>;
};

const USERS_KEY = "gamevault-tracker-users";
const SESSION_KEY = "gamevault-tracker-session";

const defaultUser: AuthUser = {
  id: "demo-user",
  email: "demo@gamevault.dev",
  password: "demo",
  displayName: "Demo Player",
  avatarColor: "from-primary to-accent",
  bio: "Exploring galaxies and cataloguing achievements since 2024.",
  privacy: "public",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 11)}`;

const loadUsers = (): AuthUser[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
    return [defaultUser];
  }

  try {
    const parsed = JSON.parse(raw) as AuthUser[];
    if (!parsed.length) {
      localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse stored users", error);
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
    return [defaultUser];
  }
};

const persistUsers = (users: AuthUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsers = loadUsers();
    setUsers(storedUsers);

    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const existing = storedUsers.find((u) => u.id === sessionId);
      setUser(existing ?? null);
    }
    setLoading(false);
  }, []);

  const register = useCallback(async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
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
      localStorage.setItem(SESSION_KEY, newUser.id);
      setUser(newUser);
      return next;
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!match) {
      throw new Error("Invalid credentials");
    }
    localStorage.setItem(SESSION_KEY, match.id);
    setUser(match);
  }, [users]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (
      updates: Partial<Omit<AuthUser, "id" | "email" | "password">> & {
        password?: string;
      },
    ) => {
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

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    users,
    register,
    login,
    logout,
    updateProfile,
  }), [user, loading, users, register, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

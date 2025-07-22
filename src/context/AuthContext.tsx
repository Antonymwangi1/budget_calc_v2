"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; name: string } | null;

interface AuthContextValue {
  user: User;
  loading: boolean;
  login: (creds: { email: string; password: string; }) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (creds: { email: string; password: string;}) => {
      await axios.post("/api/auth/login", creds);
      await fetchUser(); // get fresh user after cookie set
      router.push("/"); // or wherever
    },
    [fetchUser, router]
  );

  const logout = useCallback(async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    fetchUser(); // run on first mount
  }, [fetchUser]);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    reloadUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth anywhere.
 * If redirectToLogin=true, user will be redirected after initial load when unauthenticated.
 */
export function useAuth(redirectToLogin = false, redirectIfAuthenticated = false) {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }

  const router = useRouter();
  const { user, loading } = ctx;

  useEffect(() => {
    if (!loading) {
      if (redirectToLogin && !user) {
        router.push("/login");
      } else if (redirectIfAuthenticated && user) {
        router.push("/"); // redirect home
      }
    }
  }, [redirectToLogin, redirectIfAuthenticated, loading, user, router]);

  return ctx;
}


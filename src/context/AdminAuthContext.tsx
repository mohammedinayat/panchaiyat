import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// Fallback credentials used when Supabase env vars are not configured
const FALLBACK_EMAIL = "danish.panchaiyat@gmail.com";
const FALLBACK_PASS = "Mohddanish@panchaiyat";
const SUPABASE_CONFIGURED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== "https://placeholder.supabase.co";

type AdminAuthContextType = {
  user: User | { email: string } | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | { email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (SUPABASE_CONFIGURED) {
      // Use real Supabase session
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => listener.subscription.unsubscribe();
    } else {
      // Fallback: restore from sessionStorage
      try {
        const stored = sessionStorage.getItem("admin_fallback_user");
        if (stored) setUser(JSON.parse(stored));
      } catch { /**/ }
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (SUPABASE_CONFIGURED) {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);
      if (error) return { error: error.message };
      return { error: null };
    } else {
      // Fallback local auth
      if (email === FALLBACK_EMAIL && password === FALLBACK_PASS) {
        const u = { email };
        setUser(u);
        sessionStorage.setItem("admin_fallback_user", JSON.stringify(u));
        return { error: null };
      }
      return { error: "Invalid email or password" };
    }
  }, []);

  const logout = useCallback(async () => {
    if (SUPABASE_CONFIGURED) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem("admin_fallback_user");
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

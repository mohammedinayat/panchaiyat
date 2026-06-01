import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const ADMIN_EMAIL = "danish@panchaiyat";
const ADMIN_PASSWORD = "Mohddanish@panchaiyat";

type AdminUser = { email: string };

type AdminAuthContextType = {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
  isLoading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem("admin_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate async — swap this block with Supabase auth when ready
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const u = { email };
      setUser(u);
      sessionStorage.setItem("admin_user", JSON.stringify(u));
      return { error: null };
    }
    return { error: "Invalid email or password" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("admin_user");
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

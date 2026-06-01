import { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminMenu from "@/pages/admin/AdminMenu";
import AdminCategories from "@/pages/admin/AdminCategories";

type AdminPage = "login" | "dashboard" | "menu" | "categories";

function getPage(): AdminPage {
  const path = window.location.pathname;
  if (path === "/admin" || path === "/admin/") return "login";
  if (path.startsWith("/admin/dashboard")) return "dashboard";
  if (path.startsWith("/admin/menu")) return "menu";
  if (path.startsWith("/admin/categories")) return "categories";
  return "login";
}

export function AdminApp() {
  const { user, isLoading } = useAdminAuth();
  const [page, setPage] = useState<AdminPage>(getPage);

  // Navigate helper — updates URL and re-renders
  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPage(getPage());
  };

  // Handle browser back/forward
  useEffect(() => {
    const handler = () => setPage(getPage());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && page !== "login") {
      navigate("/admin/");
    }
  }, [user, isLoading, page]);

  // Redirect to dashboard after login
  useEffect(() => {
    if (!isLoading && user && page === "login") {
      navigate("/admin/dashboard");
    }
  }, [user, isLoading, page]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (page === "login" || !user) return <AdminLogin navigate={navigate} />;
  if (page === "dashboard") return <AdminDashboard navigate={navigate} />;
  if (page === "menu") return <AdminMenu navigate={navigate} />;
  if (page === "categories") return <AdminCategories navigate={navigate} />;

  return <AdminDashboard navigate={navigate} />;
}

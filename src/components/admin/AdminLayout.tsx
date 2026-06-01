import { useState } from "react";
import { LayoutDashboard, UtensilsCrossed, Tag, LogOut, Menu, X, ChefHat } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
  { to: "/admin/categories", label: "Categories", icon: Tag },
];

type Props = {
  children: React.ReactNode;
  navigate: (to: string) => void;
};

export function AdminLayout({ children, navigate }: Props) {
  const { user, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/");
  };

  const handleNav = (to: string) => {
    navigate(to);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:z-auto`}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-saffron to-ember grid place-items-center">
            <ChefHat className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-none">
            <div className="font-display text-lg tracking-wider text-foreground">PANCHAIYAT</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">ADMIN PANEL</div>
          </div>
          <button className="ml-auto md:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = currentPath === to || currentPath.startsWith(to);
            return (
              <button key={to} onClick={() => handleNav(to)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? "bg-saffron/15 text-saffron border border-saffron/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-saffron/20 border border-saffron/40 grid place-items-center text-saffron text-xs font-bold uppercase">
              {user?.email?.[0] ?? "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate">{user?.email}</div>
              <div className="text-[10px] text-muted-foreground">Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="h-16 flex items-center gap-4 px-5 border-b border-border bg-card/50 backdrop-blur md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display text-lg tracking-wider">ADMIN</span>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

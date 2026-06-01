import { useState, lazy, Suspense, Component, type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { MenuSection } from "@/components/MenuSection";
import { InstagramFeed } from "@/components/InstagramFeed";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { CartButton } from "@/components/CartButton";

// Lazy load admin — completely isolated from public site
const AdminRoot = lazy(() =>
  import("@/components/admin/AdminRoot").catch((e) => {
    console.error("Admin chunk failed to load:", e);
    return { default: () => (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-8 text-center">
        <div>
          <p className="text-xl font-display mb-2">Admin failed to load</p>
          <p className="text-sm text-muted-foreground mb-4">{String(e)}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-saffron text-primary-foreground rounded-lg text-sm">
            Retry
          </button>
        </div>
      </div>
    )};
  })
);

// Error boundary to catch any runtime errors in admin
class AdminErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-8 text-center">
          <div>
            <p className="text-xl font-display mb-2">Something went wrong</p>
            <p className="text-sm text-muted-foreground mb-4">{this.state.error}</p>
            <button onClick={() => window.location.href = "/admin/"} className="px-4 py-2 bg-saffron text-primary-foreground rounded-lg text-sm">
              Reload Admin
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Spinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  const path = window.location.pathname;
  const isAdmin = path === "/admin" || path.startsWith("/admin/") || path.includes("/admin");

  if (isAdmin) {
    return (
      <AdminErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <AdminRoot />
        </Suspense>
      </AdminErrorBoundary>
    );
  }

  return <PublicSite />;
}

function PublicSite() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <main>
          <Hero />
          <About />
          <MenuSection />
          <InstagramFeed />
          <OrderSection />
        </main>
        <Footer />
        <CartButton onClick={() => setCartOpen(true)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </CartProvider>
  );
}

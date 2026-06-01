import { useState, lazy, Suspense } from "react";
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

// Lazy load the entire admin bundle — keeps it completely separate from the public site
const AdminRoot = lazy(() => import("@/components/admin/AdminRoot"));

const isAdmin = window.location.pathname.startsWith("/admin");

export default function App() {
  if (isAdmin) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <AdminRoot />
      </Suspense>
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

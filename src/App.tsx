import { useState } from "react";
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
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { MenuStoreProvider } from "@/context/MenuStoreContext";
import { AdminApp } from "@/components/admin/AdminApp";

// Simple path-based router — no library needed
const path = window.location.pathname;
const isAdmin = path.startsWith("/admin");

export default function App() {
  if (isAdmin) {
    return (
      <AdminAuthProvider>
        <MenuStoreProvider>
          <AdminApp />
        </MenuStoreProvider>
      </AdminAuthProvider>
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

import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Panchaiyat Cafe & Kitchen — Dil Se Khana, Dilli Se Swad" },
      {
        name: "description",
        content:
          "Panchaiyat Cafe & Kitchen — local cafe & cloud kitchen in New Delhi. Momos, burgers, pizza, shakes & more. Open daily 4 PM – 4 AM. Order on Zomato or call +91 9891025223.",
      },
      { property: "og:title", content: "Panchaiyat Cafe & Kitchen" },
      { property: "og:description", content: "Late-night Delhi street food, delivered. Momos, burgers, pizza, shakes." },
      { property: "og:type", content: "restaurant" },
    ],
  }),
  component: Index,
});

function Index() {
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

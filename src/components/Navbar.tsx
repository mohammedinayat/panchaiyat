import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#order", label: "Order" },
  { href: "#contact", label: "Contact" },
];

type Props = {
  onCartOpen?: () => void;
};

export function Navbar({ onCartOpen }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-saffron to-ember grid place-items-center font-display text-xl text-primary-foreground">
            P
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-wider">PANCHAIYAT</div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">CAFE & KITCHEN</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-saffron transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Cart icon button */}
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-md text-muted-foreground hover:text-saffron transition"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-saffron text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <a
            href="#order"
            className="inline-flex items-center px-4 py-2 rounded-md bg-saffron text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition"
          >
            Order Now
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          {/* Mobile cart icon */}
          <button
            onClick={onCartOpen}
            className="relative p-2 text-foreground"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-saffron text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border px-5 py-4 flex flex-col gap-4"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-saffron"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-md bg-saffron text-primary-foreground font-semibold text-sm uppercase tracking-wider text-center"
          >
            Order Now
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}

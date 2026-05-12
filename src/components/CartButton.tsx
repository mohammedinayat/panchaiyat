import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Props = {
  onClick: () => void;
};

export function CartButton({ onClick }: Props) {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        key="cart-fab"
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-saffron text-primary-foreground shadow-2xl glow-saffron font-semibold"
        aria-label="Open cart"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-primary-foreground text-saffron text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        <span className="font-display tracking-wider text-base">₹{totalPrice}</span>
      </motion.button>
    </AnimatePresence>
  );
}

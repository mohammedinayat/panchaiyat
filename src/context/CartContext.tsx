import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { MenuItem } from "@/data/menu";

export type CartItem = {
  id: string; // unique key: name + category + size (if any)
  item: MenuItem;
  size?: "S" | "M" | "L";
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem, size?: "S" | "M" | "L") => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: MenuItem, size?: "S" | "M" | "L") => {
    const price = size ? item.sizes![size] : item.price!;
    const id = `${item.category}-${item.name}-${size ?? "fixed"}`;

    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) {
        return prev.map((c) => c.id === id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id, item, size, price, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id));
    } else {
      setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: qty } : c));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "919891025223";

function buildWhatsAppMessage(
  cart: ReturnType<typeof useCart>["cart"],
  total: number
): string {
  const lines = cart.map((c) => {
    const sizePart = c.size ? ` (${c.size})` : "";
    return `• ${c.item.name}${sizePart} x${c.quantity} — ₹${c.price * c.quantity}`;
  });
  lines.push("");
  lines.push(`*Total: ₹${total}*`);
  lines.push("");
  lines.push("Please confirm my order. Thank you!");
  return encodeURIComponent("*New Order from Panchaiyat Website*\n\n" + lines.join("\n"));
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage(cart, totalPrice);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-saffron" />
                <h2 className="font-display text-2xl tracking-wider">YOUR CART</h2>
                {totalItems > 0 && (
                  <span className="bg-saffron text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition text-muted-foreground hover:text-foreground"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <ShoppingCart className="w-16 h-16 opacity-20" />
                  <p className="text-lg font-display tracking-wider">CART IS EMPTY</p>
                  <p className="text-sm">Add some items from the menu!</p>
                </div>
              ) : (
                cart.map((cartItem) => (
                  <motion.div
                    key={cartItem.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary/40 border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground truncate">{cartItem.item.name}</p>
                        {cartItem.size && (
                          <span className="text-xs bg-saffron/20 text-saffron border border-saffron/30 px-1.5 py-0.5 rounded font-semibold">
                            {cartItem.size}
                          </span>
                        )}
                      </div>
                      {cartItem.item.note && (
                        <p className="text-xs text-muted-foreground mb-2">{cartItem.item.note}</p>
                      )}
                      <p className="text-saffron font-display text-lg">₹{cartItem.price * cartItem.quantity}</p>
                      <p className="text-xs text-muted-foreground">₹{cartItem.price} each</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(cartItem.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-background rounded-lg border border-border">
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="p-1.5 hover:text-saffron transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="p-1.5 hover:text-saffron transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm uppercase tracking-wider">Total</span>
                  <span className="font-display text-3xl text-saffron">₹{totalPrice}</span>
                </div>
                {totalPrice < 250 && (
                  <p className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                    Add ₹{250 - totalPrice} more for free delivery (min order ₹250)
                  </p>
                )}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-display tracking-widest text-lg transition glow-saffron"
                >
                  <MessageCircle className="w-5 h-5" />
                  ORDER ON WHATSAPP
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-destructive transition"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

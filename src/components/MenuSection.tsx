import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { menu, categories, type Diet, type MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

type Filter = "all" | "veg" | "nonveg" | "beverage";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "veg", label: "Veg" },
  { id: "nonveg", label: "Non-Veg" },
  { id: "beverage", label: "Beverages" },
];

// Category images from Unsplash (free to use)
const categoryImages: Record<string, string> = {
  MOMOS: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80",
  BURGERS: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  MAGGIE: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80",
  "VEG PIZZA": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "CHICKEN PIZZA": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "FRIES & WRAPS": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "QUICK BITES": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
  "SHAKES & COFFEE": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
};

// Per-item image overrides for specific items
const itemImages: Record<string, string> = {
  "Chicken Steam": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80",
  "Chicken Fried": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80",
  "Chicken Kurkuro": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80",
  "Chicken Gravy": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80",
  "Veg Classic": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  "Veg Cheesy": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  "Veg BBQ": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  "Chicken Classic": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "Chicken Cheesy": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "Chicken BBQ": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "Chicken Zinger": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80",
  "Plain Maggie": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80",
  "Veg Maggie": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80",
  "Veg Cheesy Maggie": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80",
  Margherita: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "Tomato & Corn": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "Simple Veg": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "Supreme Veg": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "Veg Kulhad": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "Delight Chicken": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "Chicken & Corn": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "Tandoori Chicken": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "BBQ Chicken": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "Supreme Chicken": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "Chicken Kulhad": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "Salted Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "Peri Peri Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "Cheesy Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "Cheesy Chicken Loaded Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "Veg Wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  "Chicken Wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  "Chicken Nuggets": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
  "Cheesy Chicken Nuggets": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
  "Chicken Popcorn": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
  "Cheesy Chicken Popcorn": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
  "Cold Coffee": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  "Chocolate Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "Oreo Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "KitKat Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "Strawberry Shake": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",
  "Butterscotch Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
};

function getItemImage(item: MenuItem): string {
  return itemImages[item.name] ?? categoryImages[item.category] ?? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80";
}

function DietDot({ diet }: { diet: Diet }) {
  const color =
    diet === "veg" ? "border-green-500 bg-green-500/20" :
    diet === "nonveg" ? "border-red-500 bg-red-500/20" :
    "border-amber-400 bg-amber-400/20";
  const inner = diet === "veg" ? "bg-green-500" : diet === "nonveg" ? "bg-red-500" : "bg-amber-400";
  return (
    <span className={`inline-flex w-4 h-4 border-2 rounded-sm items-center justify-center flex-shrink-0 ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${inner}`} />
    </span>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { addToCart, cart } = useCart();
  const hasSizes = !!item.sizes;

  // Track which sizes are selected (multi-select for pizza)
  const [selectedSizes, setSelectedSizes] = useState<Set<"S" | "M" | "L">>(new Set());
  const [justAdded, setJustAdded] = useState(false);

  const toggleSize = (s: "S" | "M" | "L") => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        next.delete(s);
      } else {
        next.add(s);
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (hasSizes) {
      if (selectedSizes.size === 0) return;
      selectedSizes.forEach((s) => addToCart(item, s));
      setSelectedSizes(new Set());
    } else {
      addToCart(item);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const canAdd = hasSizes ? selectedSizes.size > 0 : true;

  // Check if any variant of this item is in cart
  const inCart = cart.some((c) => c.item.name === item.name && c.item.category === item.category);

  const imgSrc = getItemImage(item);

  return (
    <motion.div
      key={`${item.category}-${item.name}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="group rounded-xl border border-border bg-card hover-glow overflow-hidden flex flex-col"
    >
      {/* Product Image */}
      <div className="relative h-40 overflow-hidden bg-secondary/40">
        <img
          src={imgSrc}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        {inCart && (
          <div className="absolute top-2 right-2 bg-saffron text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            In Cart
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <DietDot diet={item.diet} />
            <h4 className="font-semibold text-base text-foreground leading-tight">{item.name}</h4>
          </div>
          {item.price !== undefined && (
            <div className="font-display text-xl text-saffron whitespace-nowrap flex-shrink-0">
              ₹{item.price}
            </div>
          )}
        </div>

        {item.note && (
          <p className="text-xs text-muted-foreground mb-2 ml-6">{item.note}</p>
        )}

        {/* Size selector for pizza items */}
        {item.sizes && (
          <div className="mt-2 mb-3 ml-6">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
              Select size(s):
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {(["S", "M", "L"] as const).map((s) => {
                const selected = selectedSizes.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`text-center py-1.5 rounded-md border transition-all ${
                      selected
                        ? "bg-saffron border-saffron text-primary-foreground"
                        : "bg-secondary/60 border-border hover:border-saffron hover:text-saffron"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider font-semibold">{s}</div>
                    <div className={`font-display text-sm ${selected ? "text-primary-foreground" : "text-saffron"}`}>
                      ₹{item.sizes![s]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add to Cart button */}
        <div className="mt-auto pt-3">
          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all ${
              justAdded
                ? "bg-green-600 text-white"
                : canAdd
                ? "bg-saffron/10 border border-saffron/40 text-saffron hover:bg-saffron hover:text-primary-foreground hover:border-saffron"
                : "bg-secondary/40 border border-border text-muted-foreground cursor-not-allowed"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {hasSizes && selectedSizes.size === 0 ? "Select a Size" : "Add to Cart"}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function MenuSection() {
  const [filter, setFilter] = useState<Filter>("all");

  const grouped = useMemo(() => {
    return categories.map((cat) => ({
      cat,
      items: menu.filter((m) => m.category === cat && (filter === "all" || m.diet === filter)),
    })).filter((g) => g.items.length > 0);
  }, [filter]);

  return (
    <section id="menu" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-3">The Goods</div>
          <h2 className="font-display text-5xl md:text-7xl">
            FULL <span className="text-gradient-saffron">MENU</span>
          </h2>
          <p className="text-muted-foreground mt-3">All prices in ₹ · For pizza, select one or more sizes to add to cart</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-14 sticky top-16 z-30 py-3 bg-background/70 backdrop-blur-md -mx-5 px-5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm uppercase tracking-widest font-semibold border transition ${
                filter === f.id
                  ? "bg-saffron text-primary-foreground border-saffron"
                  : "border-border text-muted-foreground hover:text-saffron hover:border-saffron"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          <AnimatePresence mode="popLayout">
            {grouped.map((group) => (
              <motion.div
                key={group.cat}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-end gap-4 mb-6">
                  <h3 className="font-display text-3xl md:text-4xl text-foreground">{group.cat}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-saffron/60 to-transparent mb-2" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    {group.items.length} items
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((item, i) => (
                    <MenuCard key={`${item.category}-${item.name}-${i}`} item={item} index={i} />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

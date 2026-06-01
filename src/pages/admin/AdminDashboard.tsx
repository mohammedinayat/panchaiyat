import { UtensilsCrossed, Tag, AlertTriangle, Star, TrendingUp, ArrowRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useMenuStore } from "@/context/MenuStoreContext";

type Props = { navigate: (to: string) => void };

export default function AdminDashboard({ navigate }: Props) {
  const { items, categories, loading, error, refresh } = useMenuStore();

  if (loading) {
    return (
      <AdminLayout navigate={navigate}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout navigate={navigate}>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">{error}</p>
          <button onClick={refresh} className="px-4 py-2 rounded-lg bg-saffron text-primary-foreground text-sm">Retry</button>
        </div>
      </AdminLayout>
    );
  }

  const totalItems = items.length;
  const outOfStock = items.filter((i) => i.outOfStock).length;
  const featured = items.filter((i) => i.featured).length;
  const totalCategories = categories.length;

  const stats = [
    { label: "Total Items", value: totalItems, icon: UtensilsCrossed, color: "text-saffron", bg: "bg-saffron/10", border: "border-saffron/20" },
    { label: "Categories", value: totalCategories, icon: Tag, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { label: "Out of Stock", value: outOfStock, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
    { label: "Featured", value: featured, icon: Star, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  ];

  const catBreakdown = [...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((cat) => ({
    ...cat,
    count: items.filter((i) => i.category === cat.name).length,
    outOfStock: items.filter((i) => i.category === cat.name && i.outOfStock).length,
  }));

  const recentItems = [...items].reverse().slice(0, 5);

  return (
    <AdminLayout navigate={navigate}>
      <div className="mb-8">
        <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-1">Welcome back</div>
        <h1 className="font-display text-4xl md:text-5xl text-foreground">DASHBOARD</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your menu today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`p-5 rounded-xl border ${border} ${bg} flex flex-col gap-3`}>
            <div className={`w-9 h-9 rounded-lg bg-card/60 grid place-items-center ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className={`font-display text-3xl ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-saffron" /> CATEGORY BREAKDOWN
            </h2>
            <button onClick={() => navigate("/admin/categories")} className="text-xs text-saffron hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {catBreakdown.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-xl w-7 text-center">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{cat.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {cat.count} items
                      {cat.outOfStock > 0 && <span className="text-destructive ml-1">· {cat.outOfStock} OOS</span>}
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-saffron to-ember rounded-full transition-all"
                      style={{ width: totalItems > 0 ? `${(cat.count / totalItems) * 100}%` : "0%" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-saffron" /> RECENT ITEMS
            </h2>
            <button onClick={() => navigate("/admin/menu")} className="text-xs text-saffron hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.diet === "veg" ? "bg-green-500" : item.diet === "nonveg" ? "bg-red-500" : "bg-amber-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.category}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.outOfStock && <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/20">OOS</span>}
                  {item.featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/20">⭐</span>}
                  <span className="text-sm font-display text-saffron">
                    {item.price ? `₹${item.price}` : item.sizes ? `₹${item.sizes.S}+` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {outOfStock > 0 && (
        <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-destructive">{outOfStock} item{outOfStock > 1 ? "s are" : " is"} currently out of stock.</span>
            <span className="text-sm text-muted-foreground ml-1">Update availability in the menu section.</span>
          </div>
          <button onClick={() => navigate("/admin/menu")}
            className="text-xs text-destructive border border-destructive/40 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition flex-shrink-0">
            Fix now
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

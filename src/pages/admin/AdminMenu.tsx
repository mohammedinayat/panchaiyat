import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, AlertTriangle, Star, Filter, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ItemFormModal } from "@/components/admin/ItemFormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useMenuStore, type AdminMenuItem } from "@/context/MenuStoreContext";

type Props = { navigate: (to: string) => void };
type FilterState = { search: string; category: string; diet: string; status: string };

export default function AdminMenu({ navigate }: Props) {
  const { items, categories, loading, addItem, updateItem, deleteItem, toggleOutOfStock, toggleFeatured } = useMenuStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminMenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMenuItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ search: "", category: "all", diet: "all", status: "all" });

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const filtered = useMemo(() => items.filter((item) => {
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.diet !== "all" && item.diet !== filters.diet) return false;
    if (filters.status === "instock" && item.outOfStock) return false;
    if (filters.status === "outofstock" && !item.outOfStock) return false;
    if (filters.status === "featured" && !item.featured) return false;
    return true;
  }), [items, filters]);

  const hasActiveFilters = filters.search || filters.category !== "all" || filters.diet !== "all" || filters.status !== "all";
  const clearFilters = () => setFilters({ search: "", category: "all", diet: "all", status: "all" });

  const handleSave = async (data: Omit<AdminMenuItem, "id">) => {
    try {
      setActionError(null);
      if (editItem) { await updateItem(editItem.id, data); } else { await addItem(data); }
    } catch (e: unknown) { setActionError(e instanceof Error ? e.message : "Failed to save"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteItem(id); } catch (e: unknown) { setActionError(e instanceof Error ? e.message : "Failed to delete"); }
  };

  const catIcon = (name: string) => categories.find((c) => c.name === name)?.icon ?? "";

  return (
    <AdminLayout navigate={navigate}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-1">Manage</div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">MENU ITEMS</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} total items</p>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-saffron text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {actionError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          ⚠️ {actionError}
          <button onClick={() => setActionError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Filter className="w-3.5 h-3.5" /> Filters
              {hasActiveFilters && (
                <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-saffron hover:underline">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  placeholder="Search items..."
                  className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-saffron transition" />
              </div>
              <select value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-saffron transition">
                <option value="all">All Categories</option>
                {sortedCategories.map((c) => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
              <select value={filters.diet} onChange={(e) => setFilters(f => ({ ...f, diet: e.target.value }))}
                className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-saffron transition">
                <option value="all">All Diet Types</option>
                <option value="veg">🟢 Veg</option>
                <option value="nonveg">🔴 Non-Veg</option>
                <option value="beverage">🟡 Beverage</option>
              </select>
              <select value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-saffron transition">
                <option value="all">All Status</option>
                <option value="instock">✅ In Stock</option>
                <option value="outofstock">🚫 Out of Stock</option>
                <option value="featured">⭐ Featured</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} of {items.length} items</p>}

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-5xl mb-3 opacity-30">🍽️</div>
              <p className="text-lg font-display">NO ITEMS FOUND</p>
              <p className="text-sm mt-1">Try adjusting your filters or add a new item.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {["Item", "Category", "Diet", "Price", "Status", "Actions"].map((h, i) => (
                        <th key={h} className={`px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((item) => (
                      <tr key={item.id} className={`hover:bg-secondary/20 transition ${item.outOfStock ? "opacity-60" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{item.name}</div>
                          {item.note && <div className="text-xs text-muted-foreground mt-0.5">{item.note}</div>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{catIcon(item.category)} {item.category}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                            item.diet === "veg" ? "bg-green-500/10 border-green-500/30 text-green-400" :
                            item.diet === "nonveg" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                            "bg-amber-400/10 border-amber-400/30 text-amber-400"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.diet === "veg" ? "Veg" : item.diet === "nonveg" ? "Non-Veg" : "Beverage"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-display text-saffron">
                          {item.price ? `₹${item.price}` : item.sizes ? `₹${item.sizes.S}/${item.sizes.M}/${item.sizes.L}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.outOfStock
                              ? <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/20">Out of Stock</span>
                              : <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">In Stock</span>}
                            {item.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">⭐</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => toggleOutOfStock(item.id)} title={item.outOfStock ? "Mark in stock" : "Mark OOS"}
                              className={`p-1.5 rounded-md transition ${item.outOfStock ? "text-green-400 hover:bg-green-400/10" : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"}`}>
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                            <button onClick={() => toggleFeatured(item.id)}
                              className={`p-1.5 rounded-md transition ${item.featured ? "text-amber-400 hover:bg-amber-400/10" : "text-muted-foreground hover:text-amber-400 hover:bg-amber-400/10"}`}>
                              <Star className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-saffron hover:bg-saffron/10 transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-border">
                {filtered.map((item) => (
                  <div key={item.id} className={`p-4 ${item.outOfStock ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-medium text-foreground">{item.name}</div>
                        {item.note && <div className="text-xs text-muted-foreground">{item.note}</div>}
                        <div className="text-xs text-muted-foreground mt-0.5">{catIcon(item.category)} {item.category}</div>
                      </div>
                      <div className="font-display text-lg text-saffron flex-shrink-0">
                        {item.price ? `₹${item.price}` : item.sizes ? `₹${item.sizes.S}+` : "—"}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => toggleOutOfStock(item.id)}
                        className={`flex-1 py-1.5 rounded-lg text-xs border transition ${item.outOfStock ? "border-green-500/30 text-green-400" : "border-destructive/30 text-destructive"}`}>
                        {item.outOfStock ? "✅ In Stock" : "🚫 OOS"}
                      </button>
                      <button onClick={() => toggleFeatured(item.id)}
                        className={`py-1.5 px-3 rounded-lg text-xs border transition ${item.featured ? "border-amber-400/30 text-amber-400" : "border-border text-muted-foreground"}`}>⭐</button>
                      <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                        className="py-1.5 px-3 rounded-lg text-xs border border-border text-muted-foreground hover:text-saffron transition">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(item)}
                        className="py-1.5 px-3 rounded-lg text-xs border border-border text-muted-foreground hover:text-destructive transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ItemFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSave={handleSave} initial={editItem} categories={sortedCategories} />
      <ConfirmDialog open={!!deleteTarget} title="DELETE ITEM"
        description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}

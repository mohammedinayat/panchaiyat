import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, GripVertical, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useMenuStore, type AdminCategory } from "@/context/MenuStoreContext";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const { categories, items, loading, addCategory, updateCategory, deleteCategory, reorderCategory } = useMenuStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => { if (!user) navigate({ to: "/admin/" }); }, [user, navigate]);
  if (!user) return null;

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSave = async (data: Omit<AdminCategory, "id">) => {
    try {
      setActionError(null);
      if (editCat) { await updateCategory(editCat.id, data); } else { await addCategory(data); }
    } catch (e: unknown) { setActionError(e instanceof Error ? e.message : "Failed to save"); }
  };

  const handleDelete = async (id: string) => {
    try { setActionError(null); await deleteCategory(id); }
    catch (e: unknown) { setActionError(e instanceof Error ? e.message : "Failed to delete"); }
  };

  const handleReorder = async (id: string, dir: "up" | "down") => {
    try { await reorderCategory(id, dir); } catch { /**/ }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-1">Manage</div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">CATEGORIES</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditCat(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-saffron text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {actionError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <span>⚠️</span> {actionError}
          <button onClick={() => setActionError(null)} className="ml-auto text-destructive"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-saffron/5 border border-saffron/20 text-sm text-muted-foreground mb-6">
        <span className="text-saffron font-medium">Tip:</span> Use the arrows to reorder categories. The order here is reflected on the menu page.
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((cat, idx) => {
            const itemCount = items.filter((i) => i.category === cat.name).length;
            const oosCount = items.filter((i) => i.category === cat.name && i.outOfStock).length;
            return (
              <div key={cat.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-saffron/30 transition">
                <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 hidden sm:block" />
                <div className="w-12 h-12 rounded-xl bg-secondary/50 border border-border grid place-items-center text-2xl flex-shrink-0">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg text-foreground">{cat.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                    {oosCount > 0 && <span className="text-destructive ml-2">· {oosCount} out of stock</span>}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">#{idx + 1}</div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleReorder(cat.id, "up")} disabled={idx === 0}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition disabled:opacity-20 disabled:cursor-not-allowed">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleReorder(cat.id, "down")} disabled={idx === sorted.length - 1}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition disabled:opacity-20 disabled:cursor-not-allowed">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditCat(cat); setModalOpen(true); }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-saffron hover:bg-saffron/10 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(cat)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="text-lg font-display">NO CATEGORIES YET</p>
              <p className="text-sm mt-1">Add your first category to get started.</p>
            </div>
          )}
        </div>
      )}

      <CategoryFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditCat(null); }}
        onSave={handleSave} initial={editCat} nextSortOrder={categories.length} />
      <ConfirmDialog open={!!deleteTarget} title="DELETE CATEGORY"
        description={`Delete "${deleteTarget?.name}"? Items in this category will not be deleted.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}

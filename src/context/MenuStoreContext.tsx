/**
 * MenuStoreContext — Supabase-backed menu state for the admin panel.
 *
 * Tables required in Supabase:
 *
 * categories
 *   id          uuid primary key default gen_random_uuid()
 *   name        text not null unique
 *   icon        text not null default '🍽️'
 *   sort_order  int  not null default 0
 *   created_at  timestamptz default now()
 *
 * menu_items
 *   id           uuid primary key default gen_random_uuid()
 *   name         text not null
 *   category     text not null
 *   diet         text not null check (diet in ('veg','nonveg','beverage'))
 *   price        int  null
 *   size_s       int  null
 *   size_m       int  null
 *   size_l       int  null
 *   note         text null
 *   out_of_stock boolean not null default false
 *   featured     boolean not null default false
 *   created_at   timestamptz default now()
 *
 * RLS: enable RLS on both tables.
 *   - Public SELECT policy (anon can read)
 *   - Authenticated INSERT / UPDATE / DELETE policy (only signed-in admin can write)
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { DbCategory, DbMenuItem } from "@/lib/supabase";

// ─── Public types ──────────────────────────────────────────────────────────────

export type AdminMenuItem = {
  id: string;
  name: string;
  category: string;
  diet: "veg" | "nonveg" | "beverage";
  price?: number;
  sizes?: { S: number; M: number; L: number };
  note?: string;
  imageUrl?: string;
  outOfStock: boolean;
  featured: boolean;
};

export type AdminCategory = {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
};

// ─── Mappers ───────────────────────────────────────────────────────────────────

function dbToItem(row: DbMenuItem): AdminMenuItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    diet: row.diet,
    price: row.price ?? undefined,
    sizes:
      row.size_s != null && row.size_m != null && row.size_l != null
        ? { S: row.size_s, M: row.size_m, L: row.size_l }
        : undefined,
    note: row.note ?? undefined,
    imageUrl: row.image_url ?? undefined,
    outOfStock: row.out_of_stock,
    featured: row.featured,
  };
}

function dbToCat(row: DbCategory): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    sortOrder: row.sort_order,
  };
}

// ─── Context ───────────────────────────────────────────────────────────────────

type MenuStoreContextType = {
  items: AdminMenuItem[];
  categories: AdminCategory[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // Items
  addItem: (item: Omit<AdminMenuItem, "id">) => Promise<void>;
  updateItem: (id: string, patch: Partial<Omit<AdminMenuItem, "id">>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleOutOfStock: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  // Categories
  addCategory: (cat: Omit<AdminCategory, "id">) => Promise<void>;
  updateCategory: (id: string, patch: Partial<Omit<AdminCategory, "id">>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategory: (id: string, direction: "up" | "down") => Promise<void>;
};

const MenuStoreContext = createContext<MenuStoreContextType | null>(null);

export function MenuStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: cats, error: catErr }, { data: menuItems, error: itemErr }] =
        await Promise.all([
          supabase.from("categories").select("*").order("sort_order"),
          supabase.from("menu_items").select("*").order("created_at"),
        ]);

      if (catErr) throw catErr;
      if (itemErr) throw itemErr;

      setCategories((cats ?? []).map(dbToCat));
      setItems((menuItems ?? []).map(dbToItem));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Items ──────────────────────────────────────────────────────────────────

  const addItem = useCallback(async (item: Omit<AdminMenuItem, "id">) => {
    const row: Omit<DbMenuItem, "id" | "created_at"> = {
      name: item.name,
      category: item.category,
      diet: item.diet,
      price: item.price ?? null,
      size_s: item.sizes?.S ?? null,
      size_m: item.sizes?.M ?? null,
      size_l: item.sizes?.L ?? null,
      note: item.note ?? null,
      image_url: item.imageUrl ?? null,
      out_of_stock: item.outOfStock,
      featured: item.featured,
    };
    const { data, error } = await supabase.from("menu_items").insert(row).select().single();
    if (error) throw error;
    setItems((prev) => [...prev, dbToItem(data)]);
  }, []);

  const updateItem = useCallback(async (id: string, patch: Partial<Omit<AdminMenuItem, "id">>) => {
    const row: Partial<DbMenuItem> = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.category !== undefined) row.category = patch.category;
    if (patch.diet !== undefined) row.diet = patch.diet;
    if (patch.price !== undefined) row.price = patch.price ?? null;
    if (patch.sizes !== undefined) {
      row.size_s = patch.sizes?.S ?? null;
      row.size_m = patch.sizes?.M ?? null;
      row.size_l = patch.sizes?.L ?? null;
    }
    if (patch.note !== undefined) row.note = patch.note ?? null;
    if (patch.imageUrl !== undefined) row.image_url = patch.imageUrl ?? null;
    if (patch.outOfStock !== undefined) row.out_of_stock = patch.outOfStock;
    if (patch.featured !== undefined) row.featured = patch.featured;

    const { data, error } = await supabase
      .from("menu_items")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setItems((prev) => prev.map((i) => (i.id === id ? dbToItem(data) : i)));
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleOutOfStock = useCallback(async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateItem(id, { outOfStock: !item.outOfStock });
  }, [items, updateItem]);

  const toggleFeatured = useCallback(async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateItem(id, { featured: !item.featured });
  }, [items, updateItem]);

  // ── Categories ─────────────────────────────────────────────────────────────

  const addCategory = useCallback(async (cat: Omit<AdminCategory, "id">) => {
    const row = { name: cat.name, icon: cat.icon, sort_order: cat.sortOrder };
    const { data, error } = await supabase.from("categories").insert(row).select().single();
    if (error) throw error;
    setCategories((prev) => [...prev, dbToCat(data)]);
  }, []);

  const updateCategory = useCallback(async (id: string, patch: Partial<Omit<AdminCategory, "id">>) => {
    const row: Partial<DbCategory> = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.icon !== undefined) row.icon = patch.icon;
    if (patch.sortOrder !== undefined) row.sort_order = patch.sortOrder;

    const { data, error } = await supabase
      .from("categories")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setCategories((prev) => prev.map((c) => (c.id === id ? dbToCat(data) : c)));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const reorderCategory = useCallback(async (id: string, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === a.id) return { ...c, sortOrder: b.sortOrder };
        if (c.id === b.id) return { ...c, sortOrder: a.sortOrder };
        return c;
      })
    );

    // Persist both
    await Promise.all([
      supabase.from("categories").update({ sort_order: b.sortOrder }).eq("id", a.id),
      supabase.from("categories").update({ sort_order: a.sortOrder }).eq("id", b.id),
    ]);
  }, [categories]);

  return (
    <MenuStoreContext.Provider
      value={{
        items,
        categories,
        loading,
        error,
        refresh: fetchAll,
        addItem,
        updateItem,
        deleteItem,
        toggleOutOfStock,
        toggleFeatured,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
      }}
    >
      {children}
    </MenuStoreContext.Provider>
  );
}

export function useMenuStore() {
  const ctx = useContext(MenuStoreContext);
  if (!ctx) throw new Error("useMenuStore must be used within MenuStoreProvider");
  return ctx;
}

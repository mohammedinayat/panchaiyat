/**
 * MenuStoreContext — writable menu state for the admin panel.
 * Currently backed by localStorage for persistence.
 * When Supabase is connected, replace the load/save helpers with DB calls.
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { menu as defaultMenu, categories as defaultCategories } from "@/data/menu";
import type { MenuItem } from "@/data/menu";

export type AdminMenuItem = MenuItem & {
  id: string;
  outOfStock: boolean;
  featured: boolean;
};

export type AdminCategory = {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
};

const STORAGE_KEY_ITEMS = "admin_menu_items";
const STORAGE_KEY_CATS = "admin_categories";

const DEFAULT_ICONS: Record<string, string> = {
  MOMOS: "🥟",
  BURGERS: "🍔",
  MAGGIE: "🍜",
  "VEG PIZZA": "🍕",
  "CHICKEN PIZZA": "🍗",
  "FRIES & WRAPS": "🍟",
  "QUICK BITES": "🍿",
  "SHAKES & COFFEE": "🥤",
};

function loadItems(): AdminMenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultMenu.map((item, i) => ({
    ...item,
    id: `item-${i}-${Date.now()}`,
    outOfStock: false,
    featured: false,
  }));
}

function loadCategories(): AdminCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultCategories.map((name, i) => ({
    id: `cat-${i}`,
    name,
    icon: DEFAULT_ICONS[name] ?? "🍽️",
    sortOrder: i,
  }));
}

function saveItems(items: AdminMenuItem[]) {
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
}

function saveCategories(cats: AdminCategory[]) {
  localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(cats));
}

type MenuStoreContextType = {
  items: AdminMenuItem[];
  categories: AdminCategory[];
  // Items
  addItem: (item: Omit<AdminMenuItem, "id">) => void;
  updateItem: (id: string, patch: Partial<AdminMenuItem>) => void;
  deleteItem: (id: string) => void;
  toggleOutOfStock: (id: string) => void;
  toggleFeatured: (id: string) => void;
  // Categories
  addCategory: (cat: Omit<AdminCategory, "id">) => void;
  updateCategory: (id: string, patch: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;
  reorderCategory: (id: string, direction: "up" | "down") => void;
};

const MenuStoreContext = createContext<MenuStoreContextType | null>(null);

export function MenuStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AdminMenuItem[]>(loadItems);
  const [categories, setCategories] = useState<AdminCategory[]>(loadCategories);

  const mutateItems = useCallback((fn: (prev: AdminMenuItem[]) => AdminMenuItem[]) => {
    setItems((prev) => {
      const next = fn(prev);
      saveItems(next);
      return next;
    });
  }, []);

  const mutateCats = useCallback((fn: (prev: AdminCategory[]) => AdminCategory[]) => {
    setCategories((prev) => {
      const next = fn(prev);
      saveCategories(next);
      return next;
    });
  }, []);

  const addItem = useCallback((item: Omit<AdminMenuItem, "id">) => {
    mutateItems((prev) => [...prev, { ...item, id: `item-${Date.now()}` }]);
  }, [mutateItems]);

  const updateItem = useCallback((id: string, patch: Partial<AdminMenuItem>) => {
    mutateItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, [mutateItems]);

  const deleteItem = useCallback((id: string) => {
    mutateItems((prev) => prev.filter((i) => i.id !== id));
  }, [mutateItems]);

  const toggleOutOfStock = useCallback((id: string) => {
    mutateItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, outOfStock: !i.outOfStock } : i))
    );
  }, [mutateItems]);

  const toggleFeatured = useCallback((id: string) => {
    mutateItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i))
    );
  }, [mutateItems]);

  const addCategory = useCallback((cat: Omit<AdminCategory, "id">) => {
    mutateCats((prev) => [...prev, { ...cat, id: `cat-${Date.now()}` }]);
  }, [mutateCats]);

  const updateCategory = useCallback((id: string, patch: Partial<AdminCategory>) => {
    mutateCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, [mutateCats]);

  const deleteCategory = useCallback((id: string) => {
    mutateCats((prev) => prev.filter((c) => c.id !== id));
  }, [mutateCats]);

  const reorderCategory = useCallback((id: string, direction: "up" | "down") => {
    mutateCats((prev) => {
      const sorted = [...prev].sort((a, b) => a.sortOrder - b.sortOrder);
      const idx = sorted.findIndex((c) => c.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const next = [...sorted];
      [next[idx].sortOrder, next[swapIdx].sortOrder] = [next[swapIdx].sortOrder, next[idx].sortOrder];
      return next;
    });
  }, [mutateCats]);

  return (
    <MenuStoreContext.Provider
      value={{
        items,
        categories,
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

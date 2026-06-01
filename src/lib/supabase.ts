import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Graceful fallback — won't crash the public site if env vars are missing
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);

// ─── Database types ────────────────────────────────────────────────────────────

export type DbCategory = {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  created_at?: string;
};

export type DbMenuItem = {
  id: string;
  name: string;
  category: string;
  diet: "veg" | "nonveg" | "beverage";
  price: number | null;
  size_s: number | null;
  size_m: number | null;
  size_l: number | null;
  note: string | null;
  out_of_stock: boolean;
  featured: boolean;
  created_at?: string;
};

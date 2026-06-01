import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Only create the client if both env vars are present
export const supabase = createClient(
  supabaseUrl ?? "https://ckhsiutjaqjcptzhriya.supabase.co",
  supabaseAnonKey ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraHNpdXRqYXFqY3B0emhyaXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTE5MzcsImV4cCI6MjA5NTg4NzkzN30.MD1Cr1hU6jCKtSDRuKEl35uFIvw2QmLTh15J8zkeF2I"
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
  image_url: string | null;
  out_of_stock: boolean;
  featured: boolean;
  created_at?: string;
};

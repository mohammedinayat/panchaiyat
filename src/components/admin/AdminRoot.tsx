import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { MenuStoreProvider } from "@/context/MenuStoreContext";
import { AdminApp } from "@/components/admin/AdminApp";

// This file is lazy-loaded — Supabase is never imported on the public site
export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <MenuStoreProvider>
        <AdminApp />
      </MenuStoreProvider>
    </AdminAuthProvider>
  );
}

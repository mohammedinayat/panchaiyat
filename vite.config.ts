import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    react(),
  ],
  // Required for GitHub Pages — replace 'panchaiyat' with your repo name
  base: "/panchaiyat/",
  build: {
    outDir: "dist",
  },
});

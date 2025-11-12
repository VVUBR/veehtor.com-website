import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// If served at https://vvubr.github.io/veehtor.com-website/,
// base MUST be "/veehtor.com-website/"
export default defineConfig(() => ({
  base: process.env.GITHUB_PAGES === "true" ? "/veehtor.com-website/" : "/",
  plugins: [react(), componentTagger?.()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
}));

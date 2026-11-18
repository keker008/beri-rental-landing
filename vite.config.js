import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: process.env.GITHUB_PAGES_BASE || "/",
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({

  build: {
    cssMinify: "lightningcss",
    outDir: "esm",
    lib: {
      name: "s-table",
      formats: ["es"],
      entry: "./src/table/index.ts"
    }
  },

  server: {
    port: 3001
  },

  plugins: [
    vue()
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  }
})
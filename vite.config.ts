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
      "@": resolve(__dirname, "./src"),
      "@stable/table-typing": resolve(__dirname, "./packages/typing/index.ts"),
      "@stable/table-shared": resolve(__dirname, "./packages/shared/src/index.ts"),
      "@stable/table-vue": resolve(__dirname, "./packages/table-vue/src/index.ts"),
    }
  }
})
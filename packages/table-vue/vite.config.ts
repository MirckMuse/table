import { fileURLToPath } from "node:url";
import { dirname, join } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"


export default defineConfig({
  build: {
    lib: {
      entry: join(fileURLToPath(dirname(import.meta.url)), "./src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"]
    },
    outDir: "./esm"
  },
  plugins: [
    vue()
  ]
});

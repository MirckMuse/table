import { defineConfig } from "vite";
// import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({

  build: {
    // cssMinify: "lightningcss",
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
    vue(),
    // VitePWA({
    //   includeAssets: ["vite.svg"],
    //   manifest: {
    //     name: "Stable",
    //     "theme_color": "red",
    //     icons: [
    //       {
    //         src: "/vite.svg",
    //         sizes: "any"
    //       }
    //     ]
    //   },
    //   devOptions: {
    //     enabled: true,
    //     type: "module"
    //   },
    //   registerType: "autoUpdate",
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'image-cache',
    //         }
    //       }
    //     ]
    //   }
    // })
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@scode/table-typing": resolve(__dirname, "./packages/typing/index.ts"),
      "@scode/table-shared": resolve(__dirname, "./packages/shared/src/index.ts"),
      "@scode/table-vue": resolve(__dirname, "./packages/table-vue/src/index.ts"),
    }
  }
})
import { defineConfig } from 'vitepress'
import { resolve } from "path";
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'

export default defineConfig({
  title: "@scode/table",
  description: "A Table Component",
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  },
  themeConfig: {
    nav: [
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MirckMuse/table' }
    ]
  },

  vite: {
    resolve: {
      alias: {
        "@scode/table-typing": resolve(__dirname, "../../packages/typing/index.ts"),
        "@scode/table-shared": resolve(__dirname, "../../packages/shared/src/index.ts"),
        "@scode/table-vue": resolve(__dirname, "../../packages/table-vue/src/index.ts"),
      }
    }
  }
})

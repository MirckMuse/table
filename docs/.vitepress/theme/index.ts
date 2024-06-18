import { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Table from "@scode/table-vue";
import { Button, Tag, Divider } from "ant-design-vue";
import { AntDesignContainer } from "@vitepress-demo-preview/component"
import "@vitepress-demo-preview/component/dist/style.css"

const theme: Theme = {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.use(Table as any);
    app.use(Button as any);
    app.use(Tag as any);
    app.use(Divider as any);
    app.component('demo-preview', AntDesignContainer)
  }
}

export default theme;

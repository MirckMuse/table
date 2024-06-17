import { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Table from "@scode/table-vue";
import { Button } from "ant-design-vue";

const theme: Theme = {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.use(Table as any);
    app.use(Button as any);
  }
}

export default theme;

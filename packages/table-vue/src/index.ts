import type { Plugin, App } from "vue";
import STable from "./Table.vue";
import { EXPAND_COLUMN } from "./utils/constant";

import "./style/index.less";

export * from "./typing"

const install: Plugin = (app: App) => {
  app.component(STable.name!, STable);
}

export const Table = Object.assign(STable, {
  EXPAND_COLUMN,
  install
});

export default {
  install
}

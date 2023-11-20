import type { App, Plugin } from "vue";

import Table from "./Table.vue";

const install: Plugin = (app: App) => {
  app.component(Table.name, Table);
}

export default {
  install,
  Table
}

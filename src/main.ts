import { createApp } from "vue";
import TablePlugin from "@stable/table-vue";
import App from "./App.vue";

import "@stable/table-vue/esm/style.css";

const app = createApp(App)
app.use(TablePlugin);
app.mount("#app");

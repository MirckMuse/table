import { createApp } from "vue";
import TablePlugin from "@scode/table-vue";
import App from "./App.vue";

const app = createApp(App)
app.use(TablePlugin);
app.mount("#app");

import { createApp } from "vue";
import TablePlugin from "@stable/table-vue";
import App from "./App.vue";

const app = createApp(App)
app.use(TablePlugin);
app.mount("#app");

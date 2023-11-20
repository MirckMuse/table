import { createApp } from "vue";
import TablePlugin from "./table";
import "./table/style/index.css";

import App from "./App.vue";


const app = createApp(App)
app.use(TablePlugin);
app.mount("#app");

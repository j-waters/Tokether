import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import "@/style.scss";
import { createPinia } from "pinia";

createApp(App).use(createPinia()).use(router).mount("#app");

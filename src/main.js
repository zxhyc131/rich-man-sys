import { createApp } from "vue";
import Vant from "vant";
import "vant/lib/index.css";
import "./tailwind.css";
import App from "./App.vue";
import { routes } from "./routes.js";
import { createRouter, createWebHistory } from "vue-router";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "default-passive-events";
const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes,
});
app.use(Vant);
app.use(router);
app.use(ElementPlus);
app.mount("#app");

import { createApp } from "vue";
import { createPinia } from "pinia";
import { toLine } from "./utils";
import mUI from "@/components";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "./assets/main.css";
import "@/mock/index.ts";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(`el-icon-${toLine(key)}`, component);
}

app.use(createPinia()).use(router).use(ElementPlus).use(mUI).mount("#app");

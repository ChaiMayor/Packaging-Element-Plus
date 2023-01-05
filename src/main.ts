import { createApp } from "vue";
import { createPinia } from "pinia";
import { toLine } from "./utils";
/**
 * 全局引入未打包组件
 */
import mUI from "@/components";
/**
 * 全局引入打包组件
 */
// import mUI from "../m-ui/index.mjs";
// import "../m-ui/style.css";
/**
 * 单一引入某一打包组件
 */
// import mForm from "../m-ui/form/index.mjs";
// import "../m-ui/form/style.css";

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

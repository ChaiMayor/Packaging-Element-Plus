import type { App } from "vue";
import wangeditor from "./src/index.vue";

export default {
  install(app: App) {
    app.component("m-wangeditor", wangeditor);
  },
};

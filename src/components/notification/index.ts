import type { App } from "vue";
import notification from "./src/index.vue";

export default {
  install(app: App) {
    app.component("m-notification", notification);
  },
};

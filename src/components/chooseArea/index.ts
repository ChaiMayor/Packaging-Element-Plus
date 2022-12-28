import type { App } from "vue";
import chooseArea from "./src/index.vue";

export default {
  install(app: App) {
    app.component("m-choose-area", chooseArea);
  },
};

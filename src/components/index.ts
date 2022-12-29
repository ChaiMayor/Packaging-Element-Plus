import type { App } from "vue";
import chooseIcon from "./chooseIcon/index.ts";
import chooseArea from "./chooseArea/index.ts";
import trend from "./trend/index.ts";
import notification from "./notification/index.ts";
import list from "./list/index.ts";
import menu from "./menu/index.ts";
import progress from "./progress/index.ts";
import chooseTime from "./chooseTime/index.ts";
import chooseDate from "./chooseDate/index.ts";
import chooseCity from "./chooseCity/index.ts";
import form from "./form/index.ts";

const allComponents = [
  chooseIcon,
  chooseArea,
  trend,
  notification,
  list,
  menu,
  progress,
  chooseTime,
  chooseDate,
  chooseCity,
  form,
];

export default {
  install(app: App) {
    allComponents.map((item) => app.use(item));
  },
};

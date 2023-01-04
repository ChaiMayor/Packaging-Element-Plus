import type { App } from "vue";
import chooseIcon from "./chooseIcon/index";
import chooseArea from "./chooseArea/index";
import trend from "./trend/index";
import notification from "./notification/index";
import list from "./list/index";
import menu from "./menu/index";
import progress from "./progress/index";
import chooseTime from "./chooseTime/index";
import chooseDate from "./chooseDate/index";
import chooseCity from "./chooseCity/index";
import form from "./form/index";
import modalForm from "./modalForm/index";
import table from "./table/index";
import calendar from "./calendar/index";

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
  modalForm,
  table,
  calendar,
];

export default {
  install(app: App) {
    allComponents.map((item) => app.use(item));
  },
};

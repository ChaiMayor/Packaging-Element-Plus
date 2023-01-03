export interface menu {
  title: string;
  icon: string;
  path: string;
}

export default [
  {
    title: "首页",
    icon: "el-icon-homefilled",
    path: "/home",
  },
  {
    title: "图标选择器",
    icon: "el-icon-check",
    path: "/chooseIcon",
  },
  {
    title: "省市区选择器",
    icon: "el-icon-switch",
    path: "/chooseArea",
  },
  {
    title: "趋势标记",
    icon: "el-icon-position",
    path: "/trend",
  },
  {
    title: "通知菜单",
    icon: "el-icon-bell",
    path: "/notification",
  },
  {
    title: "侧边栏",
    icon: "el-icon-finished",
    path: "/menu",
  },
  {
    title: "进度条",
    icon: "el-icon-help",
    path: "/progress",
  },
  {
    title: "时间选择器",
    icon: "el-icon-clock",
    path: "/chooseTime",
  },
  {
    title: "日期选择器",
    icon: "el-icon-calendar",
    path: "/chooseDate",
  },
  {
    title: "城市选择器",
    icon: "el-icon-maplocation",
    path: "/chooseCity",
  },
  {
    title: "表单",
    icon: "el-icon-operation",
    path: "/form",
  },
  {
    title: "弹框表单",
    icon: "el-icon-setting",
    path: "/modalForm",
  },
  {
    title: "表格",
    icon: "el-icon-memo",
    path: "/table",
  },
];

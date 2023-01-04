import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      redirect: "/trend",
      component: () => import("@/components/container/src/index.vue"),
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("@/views/home/index.vue"),
        },
        {
          path: "chooseIcon",
          name: "chooseIcon",
          component: () => import("@/views/chooseIcon/index.vue"),
        },
        {
          path: "chooseArea",
          name: "chooseArea",
          component: () => import("@/views/chooseArea/index.vue"),
        },
        {
          path: "trend",
          name: "trend",
          component: () => import("@/views/trend/index.vue"),
        },
        {
          path: "notification",
          name: "notification",
          component: () => import("@/views/notification/index.vue"),
        },
        {
          path: "menu",
          name: "menu",
          component: () => import("@/views/menu/index.vue"),
        },
        {
          path: "progress",
          name: "progress",
          component: () => import("@/views/progress/index.vue"),
        },
        {
          path: "chooseTime",
          name: "chooseTime",
          component: () => import("@/views/chooseTime/index.vue"),
        },
        {
          path: "chooseDate",
          name: "chooseDate",
          component: () => import("@/views/chooseDate/index.vue"),
        },
        {
          path: "chooseCity",
          name: "chooseCity",
          component: () => import("@/views/chooseCity/index.vue"),
        },
        {
          path: "form",
          name: "form",
          component: () => import("@/views/form/index.vue"),
        },
        {
          path: "modalForm",
          name: "modalForm",
          component: () => import("@/views/modalForm/index.vue"),
        },
        {
          path: "table",
          name: "table",
          component: () => import("@/views/table/index.vue"),
        },
        {
          path: "calendar",
          name: "calendar",
          component: () => import("@/views/calendar/index.vue"),
        },
      ],
    },
  ],
});

export default router;

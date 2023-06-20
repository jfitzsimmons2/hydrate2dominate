import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../router/views/Home.vue"),
  },
  {
    path: "/privacy-policy",
    component: () => import("../router/views/PrivacyPolicy.vue"),
  },
];

export const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

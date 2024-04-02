import Layout from "@/layout/layout.vue";

/**
 * 框架基础路由
 */
const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    //meta: { title: "工作台", icon: "icon-desktop" },
    children: [
      {
        path: "/home",
        component: () => import("@/views/modules/home.vue"),
        meta: { title: "主页", icon: "icon-home" }
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login.vue"),
    meta: { title: "登录", isNavigationMenu: false }
  },
  {
    path: "/user/password",
    component: () => import("@/views/modules/sys/user-update-password.vue"),
    meta: { title: "修改密码", requiresAuth: true, isNavigationMenu: false }
  },
  {
    path: "/iframe/:id?",
    component: () => import("@/views/iframe.vue"),
    meta: { title: "iframe", isNavigationMenu: false }
  },
  {
    path: "/error",
    name: "error",
    component: () => import("@/views/error.vue"),
    meta: { title: "错误页面", isNavigationMenu: false }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { path: "/error", query: { to: 404 }, replace: true },
    meta: { isNavigationMenu: false }
  }
]

export default routes;

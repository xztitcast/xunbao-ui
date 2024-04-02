import { CacheToken } from "@/constants/cacheKey";
import baseService from "@/service/baseService";
import { getSysRouteMap } from "@/router";
import { removeCache } from "@/utils/cache";
import { mergeServerRoute } from "@/utils/router";
import { defineStore } from "pinia";

export const useAppStore = defineStore("useAppStore", {
  state: () => ({
    state: {
      appIsLogin: false, //是否登录
      appIsReady: false, //app数据是否就绪
      appIsRender: false, //app是否开始渲染内容
      permissions: [], //权限集合
      user: {
        createDate: "",
        deptId: "",
        deptName: "",
        email: "",
        gender: 0,
        headUrl: "",
        id: "",
        mobile: "",
        postIdList: "",
        realName: "",
        roleIdList: "",
        status: 0,
        superAdmin: 0,
        username: ""
      }, //用户信息
      routes: [], //最终的路由集合
      menus: [], //菜单集合
      routeToMeta: {}, //url对应标题meta信息
      tabs: [], //tab标签页集合
      activeTabName: "", //tab当前焦点页
      closedTabs: [] //存储已经关闭过的tab
    }
  }),
  actions: {
    updateState(data) {
      Object.keys(data).forEach((x) => {
        this.state[x] = data[x];
      });
    },
    async initApp() {
      const [menus, permissions, user] = await Promise.all([
        baseService.get("/sys/menu/nav"),
        baseService.get("/sys/menu/permissions"),
        baseService.get("/sys/user/info"), //加载用户信息
      ]);
      if (user.data.code !== 0) {
        console.error("初始化用户数据错误", user.data.message);
      }
      const [routes, routeToMeta] = mergeServerRoute(menus.data.result || [], getSysRouteMap());
      this.updateState({
        permissions: permissions.data.result || [],
        user: user.data.result || {},
        routeToMeta: routeToMeta || {},
        menus: []
      });
      return routes;
    },
    //退出
    logout() {
      removeCache(CacheToken, true);
      this.updateState({
        appIsLogin: false,
        permissions: [],
        user: {},
        menus: [],
        routes: [],
        tabs: [],
        activeTabName: ""
      });
    }
  }
})
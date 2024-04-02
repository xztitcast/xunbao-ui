<script setup>
import { EMitt, ESidebarLayoutEnum, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCache, getThemeConfigCacheByKey, getThemeConfigToClass } from "@/utils/theme";
import { getValueByKeys } from "@/utils";
import { useMediaQuery } from "@vueuse/core";
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store";
import BaseHeader from "./header/base-header.vue";
import BaseSidebar from "./sidebar/base-sidebar.vue";
import MobileSidebar from "./sidebar/mobile-sidebar.vue";
import BaseView from "./view/base-view.vue";

/**
 * 多标签页布局
 */
const isMobile = useMediaQuery("(max-width: 768px)");
const themeCache = getThemeConfigCache();
const sidebarLayoutCache = getThemeConfigCacheByKey(EThemeSetting.NavLayout, themeCache);
const router = useRouter();
const store = useAppStore();
const state = reactive({
  isShowNav: sidebarLayoutCache !== ESidebarLayoutEnum.Top,
  sidebarLayout: sidebarLayoutCache,
  themeClass: getThemeConfigToClass(themeCache),
  loading: false,
  mixLayoutRoutes: router.options.routes.find((x) => x.path === "/")?.children ?? ([])
});
const containerClassNames = computed(() =>
  Object.values(state.themeClass)
    .concat(isMobile.value ? ["ui-mobile"] : [])
    .join(" ")
);
emits.on(EMitt.OnSelectHeaderNavMenusByMixNav, (path) => {
  state.mixLayoutRoutes = store.state.routes.find((x) => x.path === path)?.children ?? [];
});
emits.on(EMitt.OnSetTheme, ([type, value]) => {
  state.themeClass[type] = "ui-" + value;
});
emits.on(EMitt.OnSetNavLayout, (vl) => {
  state.sidebarLayout = vl;
  state.isShowNav = vl !== ESidebarLayoutEnum.Top;
  if (vl === ESidebarLayoutEnum.Mix) {
    const currRoute = getValueByKeys(getValueByKeys(router.currentRoute.value.meta, "matched", [])[0], "path", "");
    state.mixLayoutRoutes = store.state.routes.find((x) => x.path === currRoute)?.children ?? [];
  }
});
emits.on(EMitt.OnLoading, (vl) => {
  state.loading = vl;
});
</script>
<template>
  <el-container :class="`tt ${containerClassNames}`" v-loading="state.loading" element-loading-background="#0000" element-loading-lock="true" element-loading-custom-class="tt-loading">
    <el-header class="tt-header" height="50px">
      <base-header></base-header>
    </el-header>
    <el-container class="tt-body">
      <el-aside v-if="state.isShowNav" class="tt-sidebar hidden-xs-only" width="auto">
        <base-sidebar v-if="state.sidebarLayout === ESidebarLayoutEnum.Left" :router="true" mode="vertical" :is-mobile="false"></base-sidebar>
        <base-sidebar v-else :menus="state.mixLayoutRoutes" :router="true" mode="vertical" :is-mobile="false"></base-sidebar>
      </el-aside>
      <div class="tt-sidebar tt-sidebar-mobile hidden-sm-and-up show-xs-only">
        <mobile-sidebar></mobile-sidebar>
      </div>
      <el-container class="tt-view-container">
        <el-main class="tt-view">
          <base-view></base-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

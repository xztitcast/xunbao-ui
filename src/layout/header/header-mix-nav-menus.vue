<script setup>
import { EMitt, ESidebarLayoutEnum, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { getValueByKeys } from "@/utils";
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store";
import BaseSidebar from "../sidebar/base-sidebar.vue";

/**
 * 顶部导航菜单，混合布局模式下用到
 */
const store = useAppStore();
const router = useRouter();
const route = useRoute();
const routers = router.options.routes;
const state = reactive({
  currRoute: getValueByKeys(getValueByKeys(router.currentRoute.value.meta, "matched", [])[0], "path", "")
});
watch(
  () => route.path,
  () => {
    if (getThemeConfigCacheByKey(EThemeSetting.NavLayout) === ESidebarLayoutEnum.Mix) {
      const matchedRoute = getValueByKeys(getValueByKeys(router.currentRoute.value.meta, "matched", [])[0], "path", "");
      if (matchedRoute) {
        state.currRoute = matchedRoute;
        emits.emit(EMitt.OnSelectHeaderNavMenusByMixNav, matchedRoute);
      }
    }
  }
);
const topHeaderMenus = computed(() => {
  const rs = [];
  store.state.routes.forEach((x) => {
    rs.push({
      path: x.path,
      children: [],
      meta: x.meta ? x.meta : {}
    });
  });
  return rs;
});
const onSelect = (path) => {
  const curr = routers.find((x) => x.path === path);

  if (!curr?.children?.length) {
    router.push(path);
  } else {
    state.currRoute = path;
    emits.emit(EMitt.OnSelectHeaderNavMenusByMixNav, path);
  }
};
</script>
<template>
  <base-sidebar mode="horizontal" :menus="topHeaderMenus" :router="false" :currRoute="state.currRoute" :is-mobile="false" :onSelect="onSelect"></base-sidebar>
</template>

<script setup>
import app from "@/constants/app";
import { EMitt, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/store";
import Tabs from "./tabs.vue";

/**
 * 业务内容视图框架
 */
const store = useAppStore();
const route = useRoute();
const state = reactive({
  openTabsPage: getThemeConfigCacheByKey(EThemeSetting.OpenTabsPage)
});
const routerKeys = ref({});
emits.on(EMitt.OnSetThemeTabsPage, (vl) => {
  state.openTabsPage = vl;
});
emits.on(EMitt.OnReloadTabPage, () => {
  routerKeys.value[route.fullPath] = new Date().getTime();
});
</script>

<template>
  <tabs v-if="state.openTabsPage" :tabs="store.state.tabs" :activeTabName="store.state.activeTabName"></tabs>
  <div class="tt-view-ctx">
    <el-card shadow="never" class="tt-view-ctx-card">
      <router-view v-slot="{ Component }">
        <keep-alive v-if="app.enabledKeepAlive">
          <component :is="Component" :key="routerKeys[$route.fullPath] || $route.fullPath" />
        </keep-alive>
        <component :is="Component" v-if="!app.enabledKeepAlive" />
      </router-view>
    </el-card>
  </div>
</template>

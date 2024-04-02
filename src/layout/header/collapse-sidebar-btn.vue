<script setup>
import SvgIcon from "@/components/svg-icon";
import { EMitt, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey, setThemeConfigToCache } from "@/utils/theme";
import { reactive } from "vue";

/**
 * PC和移动端下的侧边栏展开收起按钮
 */
const state = reactive({
  collapseSidebar: getThemeConfigCacheByKey(EThemeSetting.SidebarCollapse)
});
const onClickSidebarSwitcher = () => {
  const key = EThemeSetting.SidebarCollapse;
  state.collapseSidebar = !state.collapseSidebar;
  emits.emit(EMitt.OnSwitchLeftSidebar);
  emits.emit(EMitt.OnSetTheme, [key, key + "-" + state.collapseSidebar]);
  setThemeConfigToCache(key, state.collapseSidebar);
};
const onClickSidebarSwitcherByMobile = () => {
  emits.emit(EMitt.OnMobileOpenSidebar);
};
</script>
<template>
  <div class="hidden-xs-only" @click="onClickSidebarSwitcher">
    <svg-icon :name="state.collapseSidebar ? 'indent' : 'outdent'"></svg-icon>
  </div>
  <div class="hidden-sm-and-up show-xs-only" @click="onClickSidebarSwitcherByMobile">
    <svg-icon name="icon-indent"></svg-icon>
  </div>
</template>

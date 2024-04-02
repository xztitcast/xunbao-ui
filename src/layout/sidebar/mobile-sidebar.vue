<script setup>
import { EMitt } from "@/constants/enum";
import emits from "@/utils/emits";
import { reactive } from "vue";
import BaseSidebar from "./base-sidebar.vue";
import Logo from "../header/logo.vue";
import logoUrl from "@/assets/images/logo.png";

/**
 * 移动端侧边栏菜单
 */
const state = reactive({
  show: true
});
emits.on(EMitt.OnMobileOpenSidebar, () => {
  state.show = true;
});
const onSelect = () => {
  state.show = false;
};
</script>

<template>
  <el-drawer v-model="state.show" :append-to-body="false" size="230" :withHeader="false" direction="ltr" class="tt-setting-wrap">
    <div class="tt-header-ctx-logo tt-header-ctx-logo-mobile">
      <logo :logoUrl="logoUrl" logoName="滔滔系统"></logo>
    </div>
    <div class="tt-sidebar-mobile-inner" style="overflow: auto; height: calc(100vh - 50px); width: initial !important">
      <base-sidebar :router="true" mode="vertical" :isMobile="true" :onSelect="onSelect"></base-sidebar>
    </div>
  </el-drawer>
</template>

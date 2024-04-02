<script setup>
import SvgIcon from "@/components/svg-icon";
import baseService from "@/service/baseService";
import { useFullscreen } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store";
import userLogo from "@/assets/images/user.png";
import "@/assets/css/header.less";
import { ElMessageBox } from "element-plus";

const props = defineProps({
  userName: String
})
/**
 * 顶部右侧扩展区域
 */
const router = useRouter();
const store = useAppStore();
const { isFullscreen, toggle } = useFullscreen();

const onClickUserMenus = (path) => {
  if (path === "/login") {
    ElMessageBox.confirm("确定进行[退出]操作?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        baseService.post("/sys/logout").finally(() => {
          router.push(path);
        });
      })
      .catch(() => {
        //
      });
  } else {
    router.push(path);
  }
}
defineExpose({ store, isFullscreen, toggle })
</script>
<template>
  <div class="tt-header-right-items">
    <div>
      <a href="" target="_blank">
        <svg-icon name="icon-earth"></svg-icon>
      </a>
    </div>
    <div>
      <a href="" target="_blank">
        <svg-icon name="icon-gitee"></svg-icon>
      </a>
    </div>
    <div @click="toggle" class="hidden-xs-only">
      <span>
        <svg-icon :name="isFullscreen ? 'tuichuquanping' : 'fullscreen2'"></svg-icon>
      </span>
    </div>
    <div style="display: flex; justify-content: center; align-items: center">
      <img :src="userLogo" :alt="props.userName" style="width: 30px; height: 30px; border-radius: 50%; margin-top: 3px; margin-right: 5px" />
      <el-dropdown @command="onClickUserMenus" :popper-options="{ modifiers: [{ name: 'computeStyles', options: { adaptive: false } }] }">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="lock" command="/user/password"> 修改密码 </el-dropdown-item>
            <el-dropdown-item icon="switch-button" divided command="/login"> 退出登录 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
        <span class="el-dropdown-link" style="display: flex">
          {{ props.userName }}
          <el-icon class="el-icon--right" style="font-size: 14px"><arrow-down /></el-icon>
        </span>
      </el-dropdown>
    </div>
  </div>
</template>

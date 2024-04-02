<script setup>
import app from "@/constants/app";

/**
 * 顶部logo
 */
const props = defineProps({
  logoUrl: String,
  logoName: {
    type: String,
    default: "logo"
  }
})
</script>

<template>
  <span :class="`tt-header-ctx-logo-img-wrap ${'enabled-logo-' + app.enabledLogo}`">
    <!-- 支持显示图片logo或者产品名称缩写，二选一模式，通过注释开启功能，app.enabledLogo控制正常模式下图片logo是否显示，如果有图片logo，收起状态会强制显示图片logo -->
    <!-- <img :src="props.logoUrl" class="tt-header-ctx-logo-img" :alt="props.logoName" /> -->
    <span>滔滔</span>
    <span class="tt-header-ctx-logo-line"></span>
  </span>
  <span class="tt-header-ctx-logo-text">{{ props.logoName }}</span>
</template>

<script setup>
import classNames from "classnames";
import SvgIcon from "@/components/svg-icon";

const props = defineProps({
  menus: Array,
  hiddenIndex: Number,
  className: String
})
const getStyle = (index) => {
  const styles = [];
  const isHidden = props.hiddenIndex ? props.hiddenIndex > -1 && index > props.hiddenIndex : false;
  styles.push("display:" + (isHidden ? "none" : "block"));
  return styles.join(";");
};
</script>
<template>
  <template v-for="(x, index) in props.menus || []" :key="x.path">
    <el-sub-menu v-if="x.children && x.children.length > 0" :index="x.path" :popper-class="props.className" :class="classNames({ isMore: x.meta?.isMore })" :style="getStyle(index)">
      <template #title>
        <el-icon v-if="x.meta?.icon !== false">
          <svg-icon :name="`${x.meta?.icon || 'icon-file-fill'}`"></svg-icon>
        </el-icon>
        <span>
          <a>{{ x.meta?.title }}</a>
        </span>
      </template>
      <sidebar-menus-items :menus="x.children"></sidebar-menus-items>
    </el-sub-menu>
    <el-menu-item v-else :index="x.meta?.isNewPage ? x.path : x.path" :class="classNames({ isLink: !!x.meta?.isNewPage, isMore: x.meta?.isMore })" :style="getStyle(index)">
      <template #title>
        <a v-if="x.meta?.isNewPage" :href="`${x.meta.url}`" target="_blank" rel="opener">
          {{ x.meta.title }}
        </a>
        <a v-else>{{ x.meta?.title }}</a>
      </template>
      <el-icon v-if="x.meta?.icon !== false">
        <svg-icon :name="`${x.meta?.icon || 'icon-file-fill'}`"></svg-icon>
      </el-icon>
    </el-menu-item>
  </template>
</template>

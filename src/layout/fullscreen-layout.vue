<script setup>
import { useRoute } from "vue-router";

/**
 * 全屏布局
 */
const route = useRoute();

</script>
<template>
  <div :class="`tt-fullscreen ${route.query.pop ? 'new-pop-window' : ''}`">
    <router-view />
  </div>
</template>

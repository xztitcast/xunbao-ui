<script setup>
import { computed } from "vue"
const props = defineProps({
  prefix: {
    type: String,
    default: "icon"
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ""
  },
  width: String,
  height: String,
  className: { type: String, default: "" },
  style: { type: String, default: "" }
})
const symbolId = computed(() => `#${props.prefix}-${props.name.replace("icon-", "")}`);
</script>

<template>
  <svg aria-hidden="true" :class="`iconfont ${className}`" :style="`width:${width};height:${height};color:${color};${style}`">
    <use :xlink:href="symbolId" />
  </svg>
</template>

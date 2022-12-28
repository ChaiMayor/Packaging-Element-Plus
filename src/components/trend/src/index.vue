<template>
  <span class="trend_container" :style="{ color: textColor }">
    <span class="title">
      <slot v-if="slots.default"></slot>
      <span v-else>{{ text }}</span>
    </span>
    <component :is="showIcon" :style="{ color: iconColor }">
    </component>
  </span>
</template>

<script setup lang="ts">
import { toLine } from "@/utils";
import { useSlots, computed } from "vue";
const props = defineProps({
  // type 表示上升趋势还是下降趋势
  type: {
    type: String,
    default: 'up'  // 默认上升趋势
  },
  // text 表示趋势文字展示，两种使用方式：1.父组件传递 2.插槽
  text: {
    type: String,
    default: ''
  },
  // 颜色反转
  reversalColor: {
    type: Boolean,
    default: false
  },
  // 上升趋势图标颜色
  upIconColor: {
    type: String,
    default: '#f5222d'
  },
  // 下降趋势图标颜色
  downIconColor: {
    type: String,
    default: '#52c41a'
  },
  // 上升趋势文字颜色
  upTextColor: {
    type: String,
    default: '#000'
  },
  // 下降趋势文字颜色
  downTextColor: {
    type: String,
    default: '#000'
  },
  // 上升趋势图标
  upIcon: {
    type: String,
    default: 'ArrowUp'
  },
  // 下降趋势图标
  downIcon: {
    type: String,
    default: 'Arrowdown'
  },
})
// 获取插槽内容
const slots = useSlots()
// 获取文字颜色
const textColor = computed(() => {
  return props.type === 'up' ? props.upTextColor : props.downTextColor
})
// 获取icon图标颜色
const iconColor = computed(() => {
  // 没有颜色反转情况
  if (!props.reversalColor) {
    return props.type === 'up' ? props.upIconColor : props.downIconColor
  } else {
    return props.type === 'up' ? props.downIconColor : props.upIconColor
  }
})
// 获取显示的icon图标
const showIcon = computed(() => {
  const icon = props.type === 'up' ? props.upIcon : props.downIcon
  return /-|el/.test(icon) ? icon : `el-icon-${toLine(icon)}`
})
</script>

<style lang="scss" scoped>
.trend_container {
  display: inline-flex;
  align-items: center;
  margin-right: 20px;

  svg {
    width: 1em;
    height: 1em;
  }

  .title {
    margin-right: 6px;
  }
}
</style>

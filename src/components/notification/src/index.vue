<template>
  <div class="notification_container">
    <el-popover placement="bottom" :teleported="false" :width="300" trigger="click">
      <!-- 点击后显示的菜单 -->
      <template #default>
        <m-list :list="list" :actions="actions" @click-item="clickItem" @click-action="clickAction"></m-list>
      </template>
      <!-- 通知信息 -->
      <template #reference>
        <el-badge :value="value" :max="max" :is-dot="isDot" class="item">
          <component :is="iconMark"></component>
        </el-badge>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { toLine } from '@/utils';
import { computed } from 'vue'
import { list, actions } from '../lib'

import type { PropType } from "vue";
import type { ListItem, ListOptions, ActionOptions } from "@/components/list/src/types";

// 定义类型
export interface ItemType {
  menuTitle: string,
  index: number,
  content: ListItem
}
export interface ActionType {
  index: number,
  content: ActionOptions,
  mentTitle: string
}

const props = defineProps({
  // icon图标
  icon: {
    type: String,
    default: 'el-icon-bell'
  },
  // 通知数量
  value: {
    type: [String, Number],
    default: ''
  },
  // 通知最大数量
  max: {
    type: Number,
    default: 99
  },
  // 是否显示小圆点
  isDot: {
    type: Boolean,
    default: false
  },
  // 展示的消息列表
  list: {
    type: Array as PropType<ListOptions[]>,
    default: () => list
  },
  // 展示的操作按钮
  actions: {
    type: Array as PropType<ActionOptions[]>,
    default: () => actions
  },
})

const emits = defineEmits(['click-item', 'click-action'])

// 点击每一项
const clickItem = (item: ItemType) => {
  emits('click-item', item)
}
// 点击操作按钮
const clickAction = (item: ActionType) => {
  emits('click-action', item)
}

// 获取显示的icon图标
const iconMark = computed(() => {
  return /-|el/.test(props.icon) ? props.icon : `el-icon-${toLine(props.icon)}`
})
</script>

<style lang="scss" scoped>
.item {
  svg {
    width: 1.6em;
    height: 1.6em;
  }
}

.notification_container {
  :deep(.el-popper) {
    padding: 0;
  }

  :deep(.el-badge) {
    cursor: pointer;
  }

}
</style>

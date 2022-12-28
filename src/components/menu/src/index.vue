<template>
  <el-menu :style="`width: ${width}px`" :default-active="defaultActive" v-bind="$attrs" class="el-menu-vertical-demo">
    <template v-for="(item, index) in data" :key="index">
      <!-- 一级菜单 -->
      <template v-if="!item.children || !item.children.length">
        <el-menu-item :index="item.index">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="iconMark(item.icon)"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 二级菜单 -->
      <template v-else>
        <el-sub-menu :index="item.index">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="iconMark(item.icon)"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <template v-for="(item2, index2) in item.children" :key="index2">
            <el-menu-item :index="item2.index">
              <el-icon v-if="item2.icon">
                <component :is="iconMark(item2.icon)"></component>
              </el-icon>
              <span>{{ item2.name }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { MenuItem } from "./types";

import { ref, reactive, computed } from 'vue'
import defaultData from "../lib/data";
import { toLine } from "@/utils";

let props = defineProps({
  // 层级关系数据
  data: {
    type: Array as PropType<MenuItem[]>,
    default: defaultData
  },
  // 默认展开的层级
  defaultActive: {
    type: String
  },
  // 是否启用路由模式
  router: {
    type: Boolean,
    default: false
  },
  // 菜单展示的宽度
  width: {
    type: Number,
    default: 300
  }
})

// 获取显示的icon图标
const iconMark = (icon: string) => {
  return /-|el/.test(icon) ? icon : `el-icon-${toLine(icon)}`
}
</script>

<script lang="ts">
export default {
  name: 'MMenu'
}
</script>

<style lang="less" scoped>

</style>

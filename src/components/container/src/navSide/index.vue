<template>
  <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :collapse="props.collapse" @open="handleOpen"
    @close="handleClose" :router="true">
    <el-menu-item :index="item.path" v-for="(item, index) in menuList" :key="index">
      <el-icon>
        <component :is="item.icon"></component>
      </el-icon>
      <template #title>{{ item.title }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { menu } from '../menu'
import menuData from '../menu'

const props = defineProps<{
  collapse: boolean
}>()

// 侧边栏菜单
const menuList = reactive<menu[]>(menuData)


const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;

}
</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <NavSide :collapse="isCollapse"></NavSide>
      </el-aside>
      <el-container>
        <el-header>
          <NavHeader v-model:collapse="isCollapse"></NavHeader>
        </el-header>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import NavHeader from "./navHeader/index.vue";
import NavSide from "./navSide/index.vue";
import { ref } from "vue";

const isCollapse = ref<boolean>(false)

</script>

<style lang="scss" scoped>
.common-layout {
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      border-bottom: solid 1px var(--el-menu-border-color);
      display: flex;
      align-items: center;

    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-aside {
  width: auto;
}
</style>

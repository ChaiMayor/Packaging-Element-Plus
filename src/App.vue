<template>
  <router-view v-slot="{ Component }">
    <keep-alive max="10">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

</script>

<style lang="less" scoped>

</style>

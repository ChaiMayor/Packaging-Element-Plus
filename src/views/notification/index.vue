<template>
  <div>
    <m-notification :value="20" @click-item="clickItem" @click-action="clickAction"></m-notification>
  </div>
</template>

<script setup lang="ts">
import type { ItemType, ActionType } from "@/components/notification/src/index.vue";

const clickItem = (item: ItemType) => {
  console.log(item);
}

const clickAction = (item: ActionType) => {
  console.log(item);
}

</script>

<style lang="less" scoped>

</style>

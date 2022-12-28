<template>
  <m-choose-area @change="result" />
</template>

<script setup lang="ts">
import type { Data } from '@/components/chooseArea/src/index.vue'

const result = (res: {
  province: Data,
  city: Data,
  area: Data
}) => {
  console.log(res);
}

</script>

<style lang="scss" scoped>

</style>

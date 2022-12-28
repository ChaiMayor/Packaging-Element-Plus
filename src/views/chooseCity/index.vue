<template>
  <div style="display: flex;">
    <m-choose-city @change="chooseCityProvince"></m-choose-city>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 选择了城市或省份的事件
const chooseCityProvince = (item: string) => {
  console.log(item);
}

</script>

<style lang="less" scoped>

</style>

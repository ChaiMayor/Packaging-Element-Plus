<template>
  <div>
    <m-choose-time @changeStartTime="changeStartTime" @changeEndTime="changeEndTime"></m-choose-time>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const changeStartTime = (val: object) => {
  console.log(val);
}

const changeEndTime = (val: object) => {
  console.log(val);
}


</script>

<style lang="less" scoped>

</style>

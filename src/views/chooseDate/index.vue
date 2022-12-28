<template>
  <div>
    <m-choose-date @changeStartDate="changeStartDate" @changeEndDate="changeEndDate" :startDisabledToday="true"
      :endDisabledToday="true"></m-choose-date>
  </div>
</template>

<script setup lang="ts">
const changeStartDate = (val: object) => {
  console.log(val);
}

const changeEndDate = (val: object) => {
  console.log(val);
}

</script>

<style lang="less" scoped>

</style>

<template>
  <div>
    <m-progress :percentage="80"></m-progress>
    <br>
    <m-progress :percentage="50" :indeterminate="true"></m-progress>
    <br>
    <m-progress type="circle" :percentage="25"></m-progress>
    <br>
    <m-progress type="circle" :percentage="60"></m-progress>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

</script>

<style lang="less" scoped>

</style>

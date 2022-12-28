<template>
  <div>
    <m-trend text="营业额" />
    <m-trend text="销售额" type="down" />
    <br>
    <m-trend text="营业额" upIcon="el-icon-carettop" />
    <m-trend text="销售额" type="down" downIcon="el-icon-caretbottom" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

</script>

<style lang="scss" scoped>

</style>

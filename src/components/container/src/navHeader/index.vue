<template>
  <div class="header">
    <span @click="toToggleTabbar" class="toToggleTabbar">
      <el-icon-expand v-if="props.collapse"></el-icon-expand>
      <el-icon-fold v-else style="margin-left: 10px;"></el-icon-fold>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  collapse: boolean
}>()

const emit = defineEmits(['update:collapse'])

const toToggleTabbar = () => {
  emit('update:collapse', !props.collapse)
}

</script>

<style lang="scss" scoped>
.toToggleTabbar {
  cursor: pointer;

  svg {
    width: 1em;
    height: 1em;
  }
}
</style>

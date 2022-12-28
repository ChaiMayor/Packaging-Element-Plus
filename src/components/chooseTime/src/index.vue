<template>
  <div style="display: flex;">
    <!-- 开始时间 -->
    <el-time-select v-bind="$attrs.startTimeOptions" style="margin-right: 20px;" v-model="startTime" :max-time="endTime"
      class="mr-4" :placeholder="startPlaceholder" :start="startTimeStart" :step="startStep" :end="startMaxTime" />
    <!-- 结束时间 -->
    <el-time-select v-bind="$attrs.endTimeOptions" v-model="endTime" :disabled="disabledEndTime" :min-time="startTime"
      :placeholder="endPlaceholder" :start="endTimeStart" :step="endStep" :end="endMaxTime" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  // 开始的描述字-占位符
  startPlaceholder: {
    type: String,
    default: '请选择开始的时间'
  },
  // 开始的起始时间
  startTimeStart: {
    type: String,
    default: '08:00'
  },
  // 开始的步进时间
  startStep: {
    type: String,
    default: '00:30'
  },
  // 开始的最大时间
  startMaxTime: {
    type: String,
    default: '24:00'
  },
  // 结束的描述字-占位符
  endPlaceholder: {
    type: String,
    default: '请选择结束的时间'
  },
  // 结束起始时间
  endTimeStart: {
    type: String,
    default: '08:00'
  },
  // 结束的步进时间
  endStep: {
    type: String,
    default: '00:30'
  },
  // 结束的最大时间
  endMaxTime: {
    type: String,
    default: '24:00'
  },
})

// 开始时间
let startTime = ref<string>('')
// 结束时间
let endTime = ref<string>('')
// 是否禁用结束时间
let disabledEndTime = ref<boolean>(true)

let emits = defineEmits(['changeStartTime', 'changeEndTime'])

// 监听开始时间
watch(() => startTime.value, (val) => {
  if (val) {
    disabledEndTime.value = false
    emits('changeStartTime', {
      type: 'StartTime',
      value: val
    })
  } else {
    endTime.value = ''
    disabledEndTime.value = true
  }
})

// 监听结束时间
watch(() => endTime.value, (val) => {
  if (val) {
    emits('changeEndTime', {
      type: 'EndTime',
      value: val
    })
  }
})

</script>

<style lang="less" scoped>

</style>

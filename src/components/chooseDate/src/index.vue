<template>
  <div style="display: flex">
    <div class="block" style="margin-right: 20px;">
      <el-date-picker v-model="startDate" type="date" :disabled-date="startDisabledToday"
        :placeholder="startPlaceholder" :default-value="defaultTime" />
    </div>
    <div class="block">
      <el-date-picker :disabled="disabledEndTime" :disabled-date="endDisabledToday" v-model="endDate" type="date"
        :placeholder="endPlaceholder" :default-value="defaultTime" />
    </div>
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
  // 结束的描述字-占位符
  endPlaceholder: {
    type: String,
    default: '请选择结束的时间'
  },
  // 起始的时间点
  defaultTime: {
    type: Date,
    default: () => new Date()
  },
  // 是否禁止选择今天之前的开始时间
  startDisabledToday: {
    type: Boolean,
    default: false
  },
  // 是否禁止选择今天之前的结束时间
  endDisabledToday: {
    type: Boolean,
    default: false
  }
})

let startDate = ref<Date | null>(null)
let endDate = ref<Date | null>(null)
// 是否禁用结束时间
let disabledEndTime = ref<boolean>(true)

// 是否禁用今天之前的时间
const startDisabledToday = (time: Date) => {
  if (props.startDisabledToday) return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
}

// 是否禁用今天之前的时间
const endDisabledToday = (time: Date) => {
  if (props.endDisabledToday) return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
}

let emits = defineEmits(['changeStartDate', 'changeEndDate'])

// 监听开始时间
watch(() => startDate.value, (val) => {
  if (val) {
    disabledEndTime.value = false
    emits('changeStartDate', {
      type: 'StartDate',
      value: val
    })
  } else {
    endDate.value = null
    disabledEndTime.value = true
  }
})

// 监听结束时间
watch(() => endDate.value, (val) => {
  if (val) {
    emits('changeEndDate', {
      type: 'EndDate',
      value: val
    })
  }
})


</script>

<style lang="less" scoped>

</style>

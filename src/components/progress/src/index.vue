<template>
  <div class="demo-progress">
    <!-- <el-progress :percentage="percentageVal" :color="customColors" /> -->
    <el-progress :percentage="percentageVal" v-bind="$attrs" :color="customColorMethod" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  // 进度条百分比
  percentage: {
    type: Number,
    default: 0
  },
  // 动画时间
  animationTime: {
    type: Number,
    default: 3000
  },
  // 是否开启动画
  isAnimation: {
    type: Boolean,
    default: false
  }
})

const percentageVal = ref<number>(0)

// const customColors = [
//   { color: '#f56c6c', percentage: 20 },
//   { color: '#e6a23c', percentage: 40 },
//   { color: '#5cb87a', percentage: 60 },
//   { color: '#1989fa', percentage: 80 },
//   { color: '#6f7ad3', percentage: 100 },
// ]

const customColorMethod = (percentage: number) => {
  if (percentage < 30) {
    return '#909399'
  }
  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
}

onMounted(() => {
  let t = Math.ceil(props.animationTime / props.percentage)
  let timer = setInterval(() => {
    percentageVal.value += 1
    if (percentageVal.value >= props.percentage || percentageVal.value >= 100) {
      percentageVal.value = props.percentage >= 100 ? 100 : props.percentage
      clearInterval(timer)
    }
  }, t);
})
</script>

<style lang="scss" scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>

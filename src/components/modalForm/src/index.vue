<template>
  <div>
    <el-dialog v-bind="$attrs" v-model="dialogVisible" :before-close="beforeClose">
      <template #default>
        <el-scrollbar class="" style="height: 60vh;">
          <m-form :options="options" ref="form" label-width="70px">
            <template #uploadArea>
              <slot name="uploadArea"></slot>
            </template>
            <template #uploadTip>
              <slot name="uploadTip"></slot>
            </template>
          </m-form>
        </el-scrollbar>
      </template>
      <template #footer>
        <slot name="footer" :form="form"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormConfig } from '@/components/form/src/types/types';
import { ElDialog, ElScrollbar, type FormInstance } from 'element-plus';
import { ref, watch, type PropType } from 'vue'

// 表单的对象
let form = ref<FormInstance | null>()

let props = defineProps({
  // 自定义表单数据
  options: {
    type: Array as PropType<FormConfig[]>,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

let dialogVisible = ref<boolean>(props.visible)

let emits = defineEmits(['update:visible'])

// 空白区域点击关闭
const beforeClose = () => {
  dialogVisible.value = false
}

// 监听内部值变化
watch(() => dialogVisible.value, (val) => {
  emits('update:visible', val)
})

// 监听外部赋值变化
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

defineExpose({ form: form.value })


</script>

<style lang="less" scoped>

</style>

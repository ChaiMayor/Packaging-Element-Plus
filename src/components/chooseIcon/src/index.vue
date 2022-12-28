<template>
  <!-- 开始选择按钮 -->
  <el-button @click="handleClick" type="primary">
    <slot></slot>
  </el-button>
  <!-- 弹出框 -->
  <el-dialog :title="title" :model-value="props.visible" :before-close="close">
    <!-- 包裹物 -->
    <el-scrollbar class="el_dialog_container">
      <div class="el_dialog_container_item" @click="useCopyIcon(item)"
        v-for="(item, index) in Object.keys(ElementPlusIconsVue)" :key="index">
        <!-- icon图标 -->
        <div class="icon_container">
          <component :is="`el-icon-${toLine(item)}`"></component>
        </div>
        <!-- icon名字 -->
        <div class="icon_name">
          {{ item }}
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入所有的icon图标
import { toLine } from '@/utils';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useCopy } from "@/hooks/useCopy";

const props = defineProps<{
  // 弹出窗的标题
  title: string,
  // 控制弹出窗的显示与隐藏
  visible: boolean
}>()

const emits = defineEmits(['update:visible'])

// 打开弹出框
const handleClick = () => {
  emits('update:visible', true)
}

// 关闭弹出框
const close = (done: Function) => {
  emits('update:visible', false)
  done()
}

// 点击复制icon
const useCopyIcon = (item: string) => {
  const text: string = `<el-icon-${toLine(item)} />`
  useCopy(text)
  emits('update:visible', false)
}
</script>

<style lang="scss" scoped>
.el_dialog_container {
  width: 100%;

  :deep(.el-scrollbar__view) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 60vh;

    .el_dialog_container_item {
      text-align: center;
      width: 100px;
      margin-bottom: 38px;
      cursor: pointer;

      .icon_container {
        svg {
          width: 2em;
          height: 2em;
        }
      }

      .icon_name {
        margin-top: 6px;
      }
    }
  }

}
</style>

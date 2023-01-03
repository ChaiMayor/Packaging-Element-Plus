<template>
  <!-- 表格组件 -->
  <el-table :data="tableDataClone" style="width: 100%" v-loading="!isLoading" :element-loading-text="elementLoadingText"
    :element-loading-spinner="elementLoadingSpinner" :element-loading-background="elementLoadingBackground"
    :element-loading-svg="elementLoadingSvg" :element-loading-svg-view-box="elementLoadingSvgViewBox" v-bind="$attrs"
    @row-click="clickRow">
    <!-- 表格项 -->
    <template v-for="(item, index) in itemOptions" :key="index">
      <!-- 显示正常表格内容 -->
      <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :align="item.align">
        <template #default="scope">
          <!-- 当前可编辑的行 -->
          <template v-if="scope.row.isEditRow">
            <div style="display: flex; justify-content: center; align-items: center;">
              <el-input v-model="editableInputData[item.prop]"></el-input>
            </div>
          </template>
          <!-- 当前不可编辑的行 -->
          <template v-else>
            <!-- 点击的是当前单元格的编辑 -->
            <template v-if="scope.$index + scope.column.id === currentCell">
              <div style="display: flex; justify-content: center; align-items: center;">
                <el-input size="small" :id="scope.$index + scope.column.id" v-model="editableInput"></el-input>
                <!-- 判断是否指定了可编辑的确定取消按钮 -->
                <template v-if="$slots.editable">
                  <slot name="editable" :scope="scope" :item="item"></slot>
                </template>
                <!-- 没有指定可编辑的确定取消按钮 -->
                <template v-else>
                  <el-icon-check class="el-icon-check" @click.stop="clickCheck(scope, item)"></el-icon-check>
                  <el-icon-close class="el-icon-close" @click.stop="clickClose"></el-icon-close>
                </template>
              </div>
            </template>
            <!-- 点击编辑的不是当前单元格 -->
            <template v-else>
              <!-- 自定义插槽 -->
              <slot v-if="item.slot" :name="item.slot" :scope="scope"></slot>
              <!-- 不存在自定义插槽 -->
              <span v-else>{{ scope.row[item.prop] }}</span>
              <!-- 编辑图标 -->
              <component v-if="item.editable" class="editable" :is="iconMark" @click.stop="clickCell(scope, item)">
              </component>
            </template>
          </template>
        </template>
      </el-table-column>
    </template>
    <!-- 操作项 -->
    <template v-if="actionOptions!.action">
      <el-table-column :label="actionOptions!.label" :width="actionOptions!.width" :align="actionOptions!.align">
        <template #default="scope">
          <template v-if="scope.row.isEditRow">
            <!-- 可编辑行自定义内容 -->
            <slot v-if="$slots.isEditRow" name="isEditRow" :scope="scope"></slot>
            <!-- 可编辑行默认的内容 -->
            <div style="display: flex;" v-else>
              <el-button type="primary" @click.stop="confirmEditRow(scope)">确定</el-button>
              <el-button style="margin-left: 12px;" @click.stop="cancelEditRow(scope)">取消</el-button>
            </div>
          </template>
          <slot name="action" v-else :scope="scope"></slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
  <!-- 分页器组件 -->
  <div v-if="pagination && isLoading" class="pagination">
    <el-pagination :currentPage="currentPage" :page-sizes="pageSizes" :page-size="pageSize"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script setup lang="ts">
import type { TableOptions } from './types';
import type { PropType } from "vue";

import { ref, computed, nextTick, onMounted, watch } from 'vue'
import cloneDeep from "lodash/cloneDeep";
import { toLine } from '@/utils';

let props = defineProps({
  // 表格的配置
  options: {
    type: Array as PropType<TableOptions[]>,
    required: true
  },
  // 表格数据
  data: {
    type: Array as PropType<any[]>,
    required: true
  },
  // 加载文案
  elementLoadingText: {
    type: String,
  },
  // 加载图标名
  elementLoadingSpinner: {
    type: String,
  },
  // 加载背景颜色
  elementLoadingBackground: {
    type: String,
  },
  // 加载图标是svg
  elementLoadingSvg: {
    type: String
  },
  // 加载团是svg的配置
  elementLoadingSvgViewBox: {
    type: String,
  },
  // 编辑icon的图标
  editorIcon: {
    type: String,
    default: 'Edit'
  },
  // 是否可以编辑
  isEditableRow: {
    type: Boolean,
    default: false
  },
  // 编辑下标行
  editableRowIndex: {
    type: String,
    default: ''
  },
  // 是否显示分页
  pagination: {
    type: Boolean,
    default: false
  },
  // 显示分页的对齐方式
  paginationAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  // 当前是第几页
  currentPage: {
    type: Number,
    default: 1
  },
  // 当前一页多少条数据
  pageSize: {
    type: Number,
    default: 10
  },
  // 显示分页数据多少条的选项
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40]
  },
  // 数据总条数
  total: {
    type: Number,
    default: 0
  }
})

let emits = defineEmits(['update:editableRowIndex', 'size-change', 'current-change'])

// 过滤出来不带操作列的表格数据
let itemOptions = computed(() => props.options.filter((item) => !item.action))
// 挑选出来操作列的数据
let actionOptions = computed(() => props.options.find((item) => item.action))
// 是否加载动画
let isLoading = computed(() => props.data && props.data.length)

/**
 * 可编辑单元格的内容区域
 */
// 点前点击对象的唯一标识
let currentCell = ref<string>('')
// 可编辑状态输入框内容
let editableInput = ref<string>('')
// 取消可编辑单元格状态
const cancelEditable = () => {
  // 关闭编辑状态
  currentCell.value = ''
}
// 点击编辑按钮
const clickCell = (scope: any, item: any) => {
  // 获取点击的单元格的唯一标识
  currentCell.value = scope.$index + scope.column.id
  // 清空编辑内容
  editableInput.value = scope.row[item.prop]
  // 编辑框获得焦点
  nextTick(() => {
    let el: HTMLInputElement = document.getElementById(currentCell.value) as HTMLInputElement
    el?.focus()
  })
}
// 点击编辑的对勾
const clickCheck = (scope: any, item: any) => {
  // 更新数据
  scope.row[item.prop] = editableInput.value
  cancelEditable()
}
// 点击编辑的叉
const clickClose = () => {
  cancelEditable()
}

/**
 * 可编辑行的内容区域
 */
// 克隆一个新的data对象
let tableDataClone = ref<any[]>(cloneDeep(props.data))
// 获取父组件传递的可编辑行的按钮下标
let editableRowIndexClone = props.editableRowIndex
// 可编辑行状态输入框对象 - 用于可编辑行
let editableInputData = ref<any>({})
// 可编辑行的确定取消操作按钮
const confirmEditRow = (scope: any) => {
  for (const key in scope.row) {
    scope.row[key] = editableInputData.value[key]
  }
  scope.row.isEditRow = false
}
const cancelEditRow = (scope: any) => {
  scope.row.isEditRow = false
}
// 监听传递的可编辑行的下标
watch(() => props.editableRowIndex, (val) => {
  editableRowIndexClone = val
})
// 当父组件传递的data内容变化时，重新重置
watch(() => props.data, (val) => {
  tableDataClone.value = cloneDeep(val)
  tableDataClone.value.map((item) => {
    item.isEditRow = false
  })
}, { deep: true })
// 挂载时重置data数据内容
onMounted(() => {
  tableDataClone.value.map((item) => {
    item.isEditRow = false
  })
})

/**
 * 操作按钮列表的自定义内容
 */
// 目前可选择的按钮
// 编辑行：edit
const clickRow = (row: any, column: any) => {
  // 判断是不是点击的操作列
  if (column.label === actionOptions.value?.label) {
    // 是否当前表格可以编辑行并且当前点击的按钮下标和当前的下标相等
    if (props.isEditableRow && editableRowIndexClone === 'edit') {
      // 清空可编辑行状态输入框对象
      editableInputData.value = {}
      // 将当前行的isEditRow变为true
      row.isEditRow = true
      // 将其他的编辑行变为false
      tableDataClone.value.map((item) => {
        if (item !== row) item.isEditRow = false
      })
      // 更新可编辑行状态输入框对象
      editableInputData.value = cloneDeep(row)
      // 重置可编辑航的下标
      emits('update:editableRowIndex', '')
    }
  }
}
// 删除行
const deleteRow = (scope: any) => {
  // 先获取当前的下标
  let rowIndex = tableDataClone.value.indexOf(scope.row)
  tableDataClone.value.splice(rowIndex, 1)
}

/**
 * 分页器的内容区域
 */
// 分页的每一页数据变化
let handleSizeChange = (val: number) => {
  emits('size-change', val)
  // console.log(val)
}
// 分页页数改变
let handleCurrentChange = (val: number) => {
  emits('current-change', val)
  // console.log(val)
}

/**
 * 杂类内容
 */
// 获取显示的icon图标
const iconMark = computed(() => {
  return /-|el/.test(props.editorIcon) ? props.editorIcon : `el-icon-${toLine(props.editorIcon)}`
})

defineExpose({
  // 可编辑单元格确定
  clickCheck,
  // 可编辑单元格取消
  clickClose,
  // 可编辑行的确定
  confirmEditRow,
  // 可编辑行的取消
  cancelEditRow,
  // 删除行
  deleteRow,
  // 当前表格的数据
  tableDataClone
})
</script>

<style lang="scss" scoped>
:deep(.el-table__inner-wrapper) {
  min-height: 530px;
}

svg {
  width: 1em;
  height: 1em;
}

:deep(.cell) {
  display: flex;
  justify-content: center;
  align-items: center;

  .editable {
    margin-left: 8px;
    cursor: pointer;
  }
}

.el-icon-check {
  width: 1.3em;
  height: 1.3em;
  color: green;
  margin-left: 6px;
  cursor: pointer;
}

.el-icon-close {
  width: 1.3em;
  height: 1.3em;
  color: red;
  margin-left: 6px;
  cursor: pointer;
}

.pagination {
  margin-top: 16px;
  display: flex;

  &>div {
    flex: 1;
  }
}
</style>

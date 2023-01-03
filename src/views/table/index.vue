<template>
  <div>
    <m-table ref="table" :data="tableData" :options="tableOptions" elementLoadingText="加载中..."
      elementLoadingBackground="rgba(0,0,0,.8)" :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50" isEditableRow v-model:editableRowIndex="editableRowIndex" border
      stripe pagination :total="total" :currentPage="current" :pageSize="pageSize" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" paginationAlign="center">
      <!-- 自定义列内容插槽 -->
      <template #date="{ scope }">
        <div style="display: flex; align-items: center; justify-content: center;">
          <el-icon-timer />
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </div>
      </template>
      <template #name="{ scope }">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>name: {{ scope.row.name }}</div>
            <div>address: {{ scope.row.address }}</div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.name }}</el-tag>
          </template>
        </el-popover>
      </template>
      <!-- 可编辑状态单元格的操作按钮 -->
      <template #editable="{ scope, item }">
        <div style="display: flex; margin-left: 6px;">
          <el-button type="primary" size="small" @click.stop="clickCheck(scope, item)">确定</el-button>
          <el-button size="small" style="margin-left: 6px;" @click.stop="clickClose">取消</el-button>
        </div>
      </template>
      <!-- 自定义操作项 -->
      <template #action="{ scope }">
        <el-button type="primary" size="default" @click="editor">编辑</el-button>
        <el-popconfirm title="你确定删除本行数据吗？" width="200px" @confirm="remove(scope)">
          <template #reference>
            <el-button type="danger" size="default">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
      <!-- 可编辑行状态的按钮 -->
      <!-- <template #isEditRow="{ scope }">
        <div style="display: flex;">
          <el-button type="primary" @click.stop="confirmEditRow(scope)">确定</el-button>
          <el-button style="margin-left: 12px;" @click.stop="cancelEditRow(scope)">取消</el-button>
        </div>
      </template> -->
    </m-table>
  </div>
</template>

<script setup lang="ts">
import type { TableOptions } from '@/components/table/src/types';
import { ref, onBeforeMount } from 'vue'
import axios from "axios";

interface TableData {
  date?: string,
  name?: string,
  address?: string
}

let tableData = ref<TableData[]>([])

const tableOptions: TableOptions[] = [
  {
    label: '日期',
    prop: 'date',
    align: 'center',
    slot: 'date',
    editable: true
  },
  {
    label: '姓名',
    prop: 'name',
    align: 'center',
    slot: 'name',
  },
  {
    label: '地址',
    prop: 'address',
    align: 'center',
    editable: true
  },
  {
    label: '操作',
    prop: '',
    align: 'center',
    action: true
  },
]

// 表格的ref
const table = ref()
// 当前编辑的下标行
let editableRowIndex = ref<string>('')

// 获取表格数据
const getData = () => {
  axios.post('/api/list', {
    pageSize: pageSize.value,
    current: current.value,
  }).then((res) => {
    let data = res.data.data
    total.value = data.total
    tableData.value = data.rows
  })
}

/**
 * 分页器的数据
 */
let total = ref<number>(0)  // 总数据数量
let pageSize = ref<number>(10)    // 页面展示数据个数
let current = ref<number>(1)  // 当前页码
// 页面展示个数更新
let handleSizeChange = (val: number) => {
  pageSize.value = val
  getData()
}
// 当前页码更新
let handleCurrentChange = (val: number) => {
  current.value = val
  getData()
}
// 挂载之前获取表格数据请求
onBeforeMount(() => {
  getData()
})

// 加载动画
let svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
// 加载动画效果
// setTimeout(() => {
//   tableData.value = [
//     {
//       date: '2016-05-03',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles',
//     },
//     {
//       date: '2016-05-02',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles',
//     },
//     {
//       date: '2016-05-04',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles',
//     },
//     {
//       date: '2016-05-01',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles',
//     },
//   ]
// }, 3000);

// 点击编辑的对勾
const clickCheck = (scope: any, item: any) => {
  table.value.clickCheck(scope, item)
}
// 点击编辑的叉
const clickClose = () => {
  table.value.clickClose()
}

// 自定义操作按钮区域
const editor = () => {
  // 可编辑行的按钮下标一定要是 edit 否则不生效
  editableRowIndex.value = 'edit'
}
const remove = (scope: any) => {
  // editableRowIndex.value = 'delete'
  table.value.deleteRow(scope)
}

// 可编辑行的确定取消操作按钮
// const confirmEditRow = (scope: any) => {
//   table.value.confirmEditRow(scope)
// }
// const cancelEditRow = (scope: any) => {
//   table.value.cancelEditRow(scope)
// }
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>

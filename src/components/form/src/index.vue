<template>
  <el-form ref="form" :validate-on-rule-change="false" v-if="model" :model="model" :rules="rules" v-bind="$attrs">
    <template v-for="(item, index) in options" :key="index">
      <!-- 不存在children -->
      <el-form-item v-if="!item.children || !item.children.length" :label="item.label" :prop="item.prop">
        <!-- 其他的一般组件 -->
        <component v-if="item.type !== 'upload' && item.type !== 'editor'" :is="`el-${item.type}`"
          :placeholder="item.placeholder" v-model="model[item.prop!]" v-bind="item.attrs">
        </component>
        <!-- 上传组件 -->
        <el-upload v-if="item.type === 'upload'" v-bind="item.uploadAttrs" :on-preview="onPreview" :on-remove="onRemove"
          :on-success="onSuccess" :on-error="onError" :on-progress="onProgress" :on-change="onChange"
          :before-upload="beforeUpload" :before-remove="beforeRemove" :http-request="httpRequest" :on-exceed="onExceed">
          <slot name="uploadArea"></slot>
          <slot name="uploadTip"></slot>
        </el-upload>
        <!-- 富文本编辑器 -->
        <template v-if="item.type === 'editor'">
          <div style="border: 1px solid #ccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 500px; overflow-y: hidden;" @onChange="handleChange" v-model="valueHtml"
              :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
          </div>
        </template>
      </el-form-item>
      <!-- 存在children -->
      <el-form-item v-if="item.children && item.children!.length" :label="item.label" :prop="item.prop">
        <component :is="`el-${item.type}`" :placeholder="item.placeholder" v-model="model[item.prop!]"
          v-bind="item.attrs">
          <component v-for="(child, i) in item.children" :key="i" :is="`el-${child.type}`" :value="child.value"
            :label="child.label"></component>
        </component>
      </el-form-item>
    </template>
    <!-- 表单的提交重置按钮区域 -->
    <slot name="action" :form="form" :model="model"></slot>
  </el-form>
</template>

<script setup lang="ts">
import type { PropType, Ref, ShallowRef } from "vue";
import type { FormConfig, FormInstance } from './types/types';
import { ElForm, ElFormItem, ElUpload, type UploadFile, type UploadFiles, type UploadRawFile, type UploadRequestHandler, type UploadUserFile } from "element-plus";
import type { Awaitable } from "@vueuse/shared";

import { ref, onMounted, reactive, watch, shallowRef, nextTick } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import cloneDeep from 'lodash/cloneDeep';

// 上传表单的方法
let emits = defineEmits(['on-preview', 'on-remove', 'on-success', 'on-error', 'on-progress', 'on-change', 'before-upload', 'before-remove', 'on-exceed'])

let props = defineProps({
  // 自定义表单数据
  options: {
    type: Array as PropType<FormConfig[]>,
    required: true
  },
  // 用户自定义上传方法
  httpRequest: {
    type: Function as PropType<UploadRequestHandler>
  },
})

// 表单项的v-model总对象 
let model = ref<any>({})
// 表单验证的总对象
let rules = ref<any>({})
// 表单的对象
let form = ref<FormInstance | null>()
// 富文本编辑器内容
let editorRef: ShallowRef | null = null
let valueHtml: Ref | null = null
let toolbarConfig: object | null = null
let editorConfig = reactive({
  placeholder: '请输入内容...'
})
let handleCreated: Function | null = null
let editor: any = null
// 富文本编辑器内容修改时
const handleChange = (editor: any) => {
  let editorItem = props.options.find((item: FormConfig) => item.type === 'editor')
  if (!editorItem || editor.getHtml() === '<p><br></p>') return
  model.value[editorItem!.prop!] = editor.getHtml()
};

// 初始化表单
const initForm = () => {
  if (props.options && props.options.length) {
    let m: any = {}
    let r: any = {}
    // 遍历
    props.options.map((item: FormConfig) => {
      m[item.prop!] = item.value
      r[item.prop!] = item.rules
      if (item.type === 'editor') {
        initEditor(item)
      }
    })
    // 深拷贝
    model.value = cloneDeep(m)
    rules.value = cloneDeep(r)
  }
}

// 初始化富文本编辑器
const initEditor = (item: FormConfig) => {
  // 编辑器实例，必须用 shallowRef
  editorRef = shallowRef()
  // 内容 HTML
  valueHtml = ref()
  // 初始化内容
  toolbarConfig = {}
  // editorConfig = { placeholder: '请输入内容...' }
  handleCreated = (editor: any) => {
    editorRef!.value = editor // 记录 editor 实例，重要！
  }
  // 绑定传递过来的值
  nextTick(() => {
    editor = editorRef!.value // 获取 editor ，必须等待它渲染完之后
    if (editor == null && !item.value) return

    valueHtml!.value = item.value
  })
}

// 进入页面遍历出来表单的总对象
onMounted(() => {
  initForm()
})

// 如果表单数据发生变化，重新初始化表单
watch(() => props.options, () => {
  initForm()
}, { deep: true })

// 上传组件的所有方法
let onPreview = (file: UploadFile) => {
  emits('on-preview', file)
}
let onRemove = (file: UploadFile, fileList: UploadFiles) => {
  emits('on-remove', { file, fileList })
}
let onSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  // 上传图片成功 给表单上传项赋值
  let uploadItem = props.options.find(item => item.type === 'upload')!
  model.value[uploadItem.prop!] = { response, file, fileList }
  emits('on-success', { response, file, fileList })
}
let onError = (err: any, file: UploadFile, fileList: UploadFiles) => {
  emits('on-error', { err, file, fileList, })
}
let onProgress = (event: any, file: UploadFile, fileList: UploadFiles) => {
  emits('on-progress', { event, file, fileList })
}
let onChange = (file: UploadFile, fileList: UploadFiles) => {
  emits('on-change', { file, fileList })
}
let beforeUpload = (file: UploadRawFile) => {
  emits('before-upload', file)
}
let beforeRemove = (file: UploadFile, fileList: UploadFiles): Awaitable<boolean> => {
  emits('before-remove', { file, fileList })
  return true
}
let onExceed = (files: File[], fileList: UploadUserFile[]) => {
  emits('on-exceed', { files, fileList })
}

</script>

<style lang="less" scoped>

</style>

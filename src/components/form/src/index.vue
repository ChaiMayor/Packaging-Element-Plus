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
          <wangeditor @handleChange="handleChange" v-bind="item.editorAttrs">
            <template #instance="scope">
              {{ getEditorInstance(scope) }}
            </template>
          </wangeditor>
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
import type { PropType } from "vue";
import type { FormConfig, FormInstance } from './types/types';
import { ElForm, ElFormItem, ElUpload, type UploadFile, type UploadFiles, type UploadRawFile, type UploadRequestHandler, type UploadUserFile } from "element-plus";
import type { Awaitable } from "@vueuse/shared";

import { ref, onMounted, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep';
import wangeditor from "@/components/wangeditor/src/index.vue";

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
// 富文本对象
let editor: any = null
// 富文本的FormConfig对象
let editorItem: any = null

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
  editorItem = item
  // 设置初始值
  setTimeout(() => {
    if (editor) {
      editor.setHtml(item.value)
    }
  }, 0);
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

// 获取富文本实例对象
const getEditorInstance = (instance: any) => {
  if (!instance.editorRef) return
  editor = instance.editorRef
}
// 重新更新文本内容
const handleChange = () => {
  if (editor) {
    model.value[editorItem.prop] = editor.getHtml()
  }
};

// 重置表单项内容
const resetFields = () => {
  // 重置表单项
  form.value?.resetFields()
  // 重置富文本表单项
  if (editor) {
    editor.setHtml(editorItem.value)
  }
}

defineExpose({
  resetFields
})

</script>

<style lang="less" scoped>

</style>

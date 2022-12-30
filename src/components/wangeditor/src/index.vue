<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="$attrs" mode="default"
      @onCreated="handleCreated" @onChange="onhandleChange" />
    <slot name="instance" :editorRef="editorRef"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

let emits = defineEmits(['handleChange'])

// 内容 HTML
const valueHtml = ref<string>('')

// 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = `<p>${props.editorDefaultText}</p>`
//   }, 0)
// })

const toolbarConfig = {}
// const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// 更新内容数据
const onhandleChange = () => {
  emits('handleChange')
}
</script>

<style lang="scss" scoped>
.w-e-full-screen-container {
  z-index: 2;
}
</style>

<template>
  <div>
    <el-button type="primary" size="default" @click="open">打开弹窗</el-button>
    <m-modal-form v-model:visible="visible" :options="options" title="编辑用户">
      <template #footer="{ form }">
        <el-button @click="close(form)">重置</el-button>
        <el-button type="primary" @click="submit(form)">提交</el-button>
      </template>
      <!-- 上传组件区域 -->
      <template #uploadArea>
        <el-button type="primary">Click to upload</el-button>
      </template>
      <template #uploadTip>
        <div class="el-upload__tip" style="margin-left: 14px;">
          jpg/png files with a size less than 500KB.
        </div>
      </template>
    </m-modal-form>
  </div>
</template>

<script setup lang="ts">
import type { FormConfig } from '@/components/form/src/types/types';
import { ElButton } from 'element-plus';
import { ref } from 'vue'


const options: FormConfig[] = [
  {
    type: 'input',
    value: '努力成为最好的ikun',
    label: '用户名',
    prop: 'username',
    rules: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'blur',
      },
      {
        max: 18,
        min: 2,
        message: '用户名在2-18位之间',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'input',
    value: 'jinitaimei',
    label: '密码',
    prop: 'password',
    rules: [
      {
        required: true,
        message: '密码不能为空',
        trigger: 'blur',
      },
      {
        max: 15,
        min: 6,
        message: '密码在6-15位之间',
        trigger: 'blur'
      }
    ],
    attrs: {
      showPassword: true,
      clearable: true
    }
  },
  {
    type: 'select',
    value: '4',
    label: '职位',
    placeholder: '请选择职位',
    prop: 'role',
    attrs: {
      style: {
        width: "100%"
      }
    },
    rules: [
      {
        required: true,
        message: '员工不能为空',
        trigger: 'change',
      },
    ],
    children: [
      {
        type: 'option',
        label: '经理',
        value: '1',
      }, {
        type: 'option',
        label: '主管',
        value: '2',
      },
      {
        type: 'option',
        label: '员工',
        value: '3',
      },
      {
        type: 'option',
        label: '鸡你太美',
        value: '4',
      }
    ]
  },
  {
    type: 'checkbox-group',
    value: ['唱', '跳', '篮球'],
    label: '爱好',
    placeholder: '请选择爱好',
    prop: 'like',
    rules: [
      {
        required: true,
        message: '爱好不能为空',
        trigger: 'change',
      },
    ],
    children: [
      {
        type: 'checkbox',
        label: '唱',
        value: '1',
      }, {
        type: 'checkbox',
        label: '跳',
        value: '2',
      }, {
        type: 'checkbox',
        label: 'rap',
        value: '3',
      },
      {
        type: 'checkbox',
        label: '篮球',
        value: '4',
      }, {
        type: 'checkbox',
        label: 'music',
        value: '5',
      },
    ]
  },
  {
    type: 'radio-group',
    value: '男',
    label: '性别',
    prop: 'gender',
    rules: [
      {
        required: true,
        message: '性别不能为空',
        trigger: 'change',
      },
    ],
    children: [
      {
        type: 'radio',
        label: '男',
        value: 'male',
      }, {
        type: 'radio',
        label: '女',
        value: 'female',
      }, {
        type: 'radio',
        label: '外星人',
        value: 'not',
      }
    ]
  },
  {
    type: 'upload',
    label: '上传',
    value: '',
    prop: 'pic',
    rules: [
      {
        required: true,
        message: '上传不能为空',
        trigger: 'blur',
      },
    ],
    uploadAttrs: {
      action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
      multiple: true,
      limit: 3
    }
  },
  {
    type: 'editor',
    value: '',
    prop: 'wangeditor',
    label: '描述',
    editorAttrs: {
      placeholder: '不要输入内容了',
    },
    rules: [
      {
        required: true,
        message: '描述不能为空',
        trigger: 'blur',
      },
    ]
  }
]


let visible = ref<boolean>(false)

const open = () => {
  visible.value = true
}

// 关闭弹窗 
const close = (form: any) => {
  form.resetFields()
  visible.value = false
}

// 提交表单
const submit = (form: any) => {
  if (form.submitFields()) {
    visible.value = false
  }
}


</script>

<style lang="less" scoped>

</style>

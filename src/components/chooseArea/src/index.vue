<template>
  <div>
    <el-select clearable v-model="province" class="m-1" placeholder="请选择省份" size="large">
      <el-option v-for="item in address" :key="item.code" :label="item.name" :value="item.code" />
    </el-select>
    <el-select clearable v-model="city" :disabled="!province" class="m-2" placeholder="请选择城市" size="large"
      style="margin: 0 10px;">
      <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code" />
    </el-select>
    <el-select clearable v-model="area" :disabled="!province || !city" class="m-3" placeholder="请选择地区" size="large">
      <el-option v-for="item in areaList" :key="item.code" :label="item.name" :value="item.code" />
    </el-select>
  </div>
</template>
 
<script setup lang="ts">
import { ref, watch } from 'vue'
import address from "../lib/pca-code.json";

// 省市区里面的对象
export interface AreaItem {
  name: string,
  code: string,
  children?: AreaItem[]
}

// 返回的数据
export interface Data {
  name: string,
  code: string,
}

// change函数
const emits = defineEmits(['change']);

// 初始化数据 
let province = ref<string>('')
let city = ref<string>('')
let area = ref<string>('')

// 城市展示的数据
let cityList = ref<AreaItem[]>([])
// 监听选择省份
watch(() => province.value, (newVal) => {
  // 防止空数据
  if (newVal) {
    // 获取子级数据
    cityList.value = address.find((item) => (province.value === item.code))!.children
  }
  // 重置前面的数据
  city.value = ''
  area.value = ''
})

// 地区展示的数据
let areaList = ref<AreaItem[]>([])
// 监听选择城市
watch(() => city.value, (newVal) => {
  // 防止空数据
  if (newVal) {
    // 获取子级数据
    areaList.value = cityList.value.find((item) => (city.value === item.code))!.children!
  }
  // 重置前面的数据
  area.value = ''
})

// 监听选择区域 
watch(() => area.value, (newVal) => {
  if (newVal) {
    let provinceData: Data = {
      name: address.find((item) => (item.code === province.value))!.name,
      code: province.value
    }
    let cityData: Data = {
      name: cityList.value.find((item) => (item.code === city.value))!.name,
      code: city.value
    }
    let areaData: Data = {
      name: areaList.value.find((item) => (item.code === newVal))!.name,
      code: newVal
    }
    emits('change', {
      province: provinceData,
      city: cityData,
      area: areaData
    })
  }
})


</script>

<style lang="scss" scoped>

</style>

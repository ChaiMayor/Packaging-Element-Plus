<template>
  <el-popover placement="bottom-end" v-model:visible="visible" :width="450" trigger="click"
    class="choose_city_container">
    <template #reference>
      <div style="display: flex;align-items: center;cursor: pointer;">
        {{ cityVal }}
        <el-icon-arrowdown :class="['choose_city_svg', { rotate: visible }]" />
      </div>
    </template>
    <template #default>
      <div style="display: flex;">
        <div class="choose_address" style="margin-right: 20px;">
          <el-radio-group v-model="chooseAddress">
            <el-radio-button label="按城市" />
            <el-radio-button label="按省份" />
          </el-radio-group>
        </div>
        <el-select-v2 @change="selectCity" v-model="value" @visible-change="visibleChange" :filter-method="filterMethod"
          filterable :options="options" placeholder="请选择城市" style="width: 240px" />
      </div>
      <template :class="['display_container', { show: chooseAddress === '按城市' }]">
        <div class="tag_container">
          <div class="tag_container_item" @click="skipToScroll(item)"
            v-for="(item, index) in Object.keys(cityData.cities)" :key="index">{{ item }}
          </div>
        </div>
        <el-scrollbar height="300px" class="tag_info_container">
          <el-row class="tag_info_box" :id="key" v-for="(value, key) in city.cities" :key="key">
            <el-col :span="2">
              {{ key }} :
            </el-col>
            <el-col :span="22" class="tag_name_container">
              <span class="tag_name" v-for="(item, index) in value" :key="index" @click="chooseCity(item)">
                {{ item.name }}
              </span>
            </el-col>
          </el-row>
        </el-scrollbar>
      </template>
      <template :class="['display_container', { show: chooseAddress !== '按城市' }]">
        <div class="tag_container">
          <div class="tag_container_item" @click="skipToScrollProvince(key)" v-for="(value, key) in province"
            :key="key">{{ key }}
          </div>
        </div>
        <el-scrollbar height="300px" class="tag_info_container">
          <div :id="key" v-for="(value, key) in province" :key="key">
            <el-row class="tag_info_box tag_info_box2" :id="item.id" v-for="(item, index) in value" :key="index">
              <el-col class="tag_title" :span="item.name === '直辖市' ? 3 : 2">
                {{ item.name }} :
              </el-col>
              <el-col :span="item.name === '直辖市' ? 21 : 22" class="tag_name_container tag_name_container2">
                <span class="tag_name" v-for="(v, i) in item.data" :key="i" @click="chooseProvince(v)">
                  {{ v }}
                </span>
              </el-col>
            </el-row>
          </div>
        </el-scrollbar>
      </template>
    </template>
  </el-popover>
</template> 

<script setup lang="ts">
import type { City, CityV2 } from "../types";

import { ref } from 'vue'
import city from "../lib/city";
import province from "../lib/province.json";

// 替换对象中的key为其他的名字
const changeKey = (arr: any[], key: string[]) => {
  let newArr: any[] = [];
  arr.forEach((item) => {
    let newObj: any = {};
    for (var i = 0; i < key.length; i++) {
      newObj[key[i]] = item[Object.keys(item)[i]]
    }
    newArr.push(newObj);
  })
  return newArr;
}

// 开始的默认文字
let cityVal = ref<string>('请选择城市')
// 下拉框选择的城市
let value = ref<string>('请选择城市')
// 下拉图标改变方向
let visible = ref<boolean>(false)
// 城市省份选择
let chooseAddress = ref<string>('按城市')
// 城市数据
let cityData = ref(city)
// 所有的城市数据
let allCity = changeKey(Object.values(city.cities).flat(2), ['id', 'value', 'label'])

let emits = defineEmits(['change'])

// 下拉选择城市
let options = ref<CityV2[]>([])

// 选择城市地区
const chooseCity = (item: City) => {
  cityVal.value = item.name
  visible.value = false
  value.value = '请选择城市'
  emits('change', item.name)
}

// 选择城市地区
const chooseProvince = (item: string) => {
  cityVal.value = item
  visible.value = false
  value.value = '请选择城市'
  emits('change', item)
}

// 跳转对应的滚动条
const skipToScroll = (id: string) => {
  let el = document.getElementById(id)
  if (el) el.scrollIntoView({
    // 平滑滑动到元素高度
    // behavior: "smooth",
  })
}

// 跳转对应的滚动条
const skipToScrollProvince = (id: string) => {
  let el = document.getElementById(id)
  if (el) el.scrollIntoView({
    // 平滑滑动到元素高度
    // behavior: "smooth",
  })
}

// 下拉选择框
const selectCity = (val: string) => {
  cityVal.value = Object.values(city.cities).flat(2).find((item) => item.spell === val)?.name!
  emits('change', cityVal.value)
}

// 自定义筛选器
const filterMethod = (val: string) => {
  if (val === '') {
    options.value = allCity
  } else {
    if (/[A-z]/.test(val)) {
      console.log('英文');

      options.value = allCity.filter((item) => item.value.includes(val))

      console.log(options.value);

    } else {
      console.log('中文');

      options.value = allCity.filter((item) => item.label.includes(val))

      console.log(options.value);
    }
  }
}

// 城市选择下拉框显示和消失的时候
const visibleChange = () => {
  options.value = allCity
}
</script>

<style lang="scss" scoped>
.display_container {
  display: none;

  &.show {
    display: block;
  }
}

.choose_city_svg {
  width: 1em;
  height: 1em;
  margin-left: 6px;
  transition: transform .2s linear;

  &.rotate {
    transform: rotate(180deg);
  }
}

.tag_container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;

  .tag_container_item {
    cursor: pointer;
    padding: 4px 8px;
    border: 1px solid #eee;
    margin-right: 6px;
    margin-bottom: 6px;
    border-radius: 4px;
    transition: border .2s;

    &:hover {
      border: 1px solid #78b5f1;
    }
  }
}

.tag_info_container {
  margin-top: 10px;

  .tag_info_box {
    margin-bottom: 10px;
    padding-left: 4px;

    &.tag_info_box2 {
      padding-left: 2px;
    }

    .tag_title {
      white-space: nowrap;

      &.tag_title_shi {
        margin-right: 10px;
      }
    }
  }

  .tag_name_container {
    display: flex;
    flex-wrap: wrap;

    &.tag_name_container2 {
      padding-left: 8px;
    }

    .tag_name {
      margin-right: 6px;
      margin-bottom: 6px;
      white-space: nowrap;
      cursor: pointer;
    }
  }
}
</style>

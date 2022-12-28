<template>
  <div class="list_container">
    <!-- 标签栏 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :label="item.title" :name="item.title" v-for="(item, index) in list" :key="index">
        <!-- 列表项的总容器 -->
        <div class="list_item_container">
          <!-- 每一个列表项 -->
          <div class="list_item" @click="handleClickItem(item2, index2, item.title)"
            v-for="(item2, index2) in item.content" :key="index2">
            <!-- 头像区域 -->
            <div class="list_item_start">
              <img :src="item2.avatar" alt="">
            </div>
            <!-- 右侧文本区域 -->
            <div class="list_item_end">
              <!-- 标题 -->
              <div class="list_item_end_title_box">
                <div class="list_item_end_title">
                  {{ item2.title }}
                </div>
                <el-tag :type="item2.tagType" class="list_item_end_title_tag" v-if="item2.tag">
                  {{ item2.tag }}
                </el-tag>
              </div>
              <!-- 描述 -->
              <div class="list_item_end_desc" v-if="item2.desc">
                {{ item2.desc }}
              </div>
              <!-- 时间 -->
              <div class="list_item_end_time" v-if="item2.time">
                {{ item2.timeType === 'format' ? useTimeFormat(item2.time!) : item2.timeType === 'timing' ?
                    useTiming(item2.time!) : ''
                }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 操作按钮栏 -->
    <div class="actions_tools_container">
      <div class="actions_tools" @click="handleClickAction(item, index)" v-for="(item, index) in actions" :key="index">
        <div class="actions_tools_box">
          <component v-if="item.icon" :is="`el-icon-${toLine(item.icon)}`"></component>
          <span class="actions_tools_text">{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 类型区
import type { PropType } from 'vue'
import type {
  ListItem,
  ListOptions,
  ActionOptions,
} from "./types";
import type { TabsPaneContext } from 'element-plus'
// 工具区
import { toLine } from '@/utils';
import {
  useTimeFormat,
  useTiming
} from '@/hooks/useTimeFormat'
import { ref } from 'vue'

const props = defineProps({
  // 传递的列表数据
  list: {
    type: Array as PropType<ListOptions[]>,
    required: true,
  },
  // 操作内容
  actions: {
    type: Array as PropType<ActionOptions[]>,
    default: () => []
  }
})

const emits = defineEmits(['click-item', 'click-action'])

const activeName = ref(props.list[0].title)

// 切换菜单项
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event)
}

// 列表中的每一项，返回他的信息
const handleClickItem = (item: ListItem, index: number, title: string) => {
  emits('click-item', {
    menuTitle: title,
    index,
    content: item
  })
}
// 操作按钮，返回他的操作信息
const handleClickAction = (item: ActionOptions, index: number) => {
  emits('click-action', {
    menuTitle: activeName.value,
    index,
    content: item
  })
}

</script>

<style lang="scss" scoped>
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.list_container {
  svg {
    width: 1em;
    height: 1em;
  }

  :deep(.demo-tabs) {
    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__nav {
      width: 100%;
      display: flex;

      &>.el-tabs__item {
        flex: 1;
        text-align: center;
        padding: 0;

      }
    }

    .el-tabs__content {
      border-bottom: 2px solid #e9e9e9;
    }

    .list_item_container {
      padding: 6px 0;
    }

    .list_item {
      display: flex;
      flex: 1;
      padding: 10px 0;
      padding-right: 20px;
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background-color: #e4ebf1;
      }

      .list_item_start {
        flex: 0 0 34px;
        overflow: hidden;
        height: 34px;
        border-radius: 50%;
        margin: 0 20px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .list_item_end {
        flex: 1;
      }

      .list_item_end_title_box {
        font-size: 14px;
        display: flex;
        justify-content: space-between;

        .list_item_end_title {
          margin-right: 10px;
        }

        .el-tag {
          height: 20px;
          padding: 0 6px;
        }

        .list_item_end_title_tag {
          font-size: 12px;
        }

        // .list_item_end_title_tag {
        //   position: absolute;
        //   right: 0;
        //   top: 0;
        // }
      }

      .list_item_end_time {
        font-size: 12px;
        color: #999;
      }

      .list_item_end_desc {
        font-size: 12px;
        color: #999;
        margin: 4px 0;
      }
    }
  }

  .actions_tools_container {
    display: flex;

    .actions_tools {
      flex: 1;
      position: relative;

      &:not(:last-of-type) {
        &::after {
          content: '';
          height: 100%;
          width: 1px;
          background-color: #e9e9e9;
          right: 0;
          top: 0;
          position: absolute;
        }
      }

      .actions_tools_box {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 40px;
        justify-content: center;
        transition: color .3s;

        &:hover {
          color: #409eff;

        }
      }

      .actions_tools_text {
        margin-left: 6px;
      }
    }
  }
}
</style>

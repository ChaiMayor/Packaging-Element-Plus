# 一、项目初始化

## 1. 创建项目

项目根目录打开 `cmd`，输入 `npm init vue@latest`

根据配置自行选择即可，需要有的 `ts, router`



## 2. 安装依赖

~~~shell
# 组件库
npm i element-plus 
# 依赖
npm i sass sass-loader
~~~



## 二、项目开始

## 1. 自定义 icon 

下载包：

```shell
# NPM
$ npm install @element-plus/icons-vue
```



# 三、学习到的小妙招

## 1. 动态渲染组件

有一大堆的组件需要渲染，恰好你还拥有他们的组件名称的数组，可以使用 `component` 这个内置组件来进行批量渲染到页面上

使用方法

~~~vue
<template>
	<div class="el_dialog_container_item" v-for="(item, index) in Object.keys(ElementPlusIconsVue)" :key="index">
  <!-- icon图标 -->
  <div class="icon_container">
    <!-- 动态的进行渲染 -->
    <component :is="`el-icon-${toLine(item)}`"></component>
  </div>
  <!-- icon名字 -->
  <div class="icon_name">
    {{ item }}
  </div>
  </div>
</template>

<script setup lang="ts">
// 拥有组件名称的数组
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
</script>
~~~



## 2. 复制内容到剪贴板

在 `hooks` 文件夹里面封装一个 `useCopy` 方法，用于复制指定内容

~~~js
// hooks/useCopy.js 
import { ElMessage } from "element-plus";

// 复制文本
export const useCopy = (text: string) => {
  // 创建输入框
  const input: HTMLInputElement = document.createElement("input");
  // 给输入框value赋值
  input.value = text;
  // 追加到body里面
  document.body.appendChild(input);
  // 选择输入框的操作
  input.select();
  // 执行复制操作
  document.execCommand("Copy");
  // 删除加入的输入框
  document.body.removeChild(input);
  // 提示用户
  ElMessage.success("复制成功");
};
~~~



## 3. 统一注册和分别注册全局组件

### 1）组件文件格式

components 文件夹下创建：

1. xxxx 组件名：这个组件的名字
   1. src ：组件的主文件入口
   2. index.ts ：方便进行分别注册全局组件
2. index.ts ：方便进行统一全局注册组件

![image-20221224111724286](https://oss.zhishiyu.online/markdown_images/202212241117385.png) 



### 2）分别注册全局组件

将组件的文件主入口进行引入：`mChooseArea`，在这里注册使用全局组件

~~~js
import type { App } from "vue";
import chooseArea from "./src/index.vue";

export default {
  install(app: App) {
    app.component("m-choose-area", chooseArea);
  },
};
~~~



### 3）统一注册全局组件

将所有的组件的注册文件 `index.ts` 进行引入，然后将所有的组件进行遍历注册

~~~js
import type { App } from "vue";
import chooseIcon from "./chooseIcon/index.ts";
import chooseArea from "./chooseArea/index.ts";

const allComponents = [chooseIcon, chooseArea];

export default {
  install(app: App) {
    allComponents.map((item) => app.use(item));
  },
};
~~~



### 4）选择引入方式

`app.use()` 使用的话，会自动执行里面的 `install` 函数

---

全局引入

~~~js
// main.ts 
import mUI from "@/components/index.ts";   // 引入主文件

app.use(mUI).mount("#app");
~~~

分别引入

~~~js
// main.ts 
import chooseArea from "@/components/chooseArea/index.ts";   // 引入组件的主文件

app.use(chooseArea).mount("#app");
~~~



## 4. 编码时注意点

### 1）样式穿透

在使用 `sass` 进行样式穿透的时候，使用的是 `::v-deep` 这个 vite 进行了警告说：该方法已经废弃，请使用 `:deep()` 新方法

~~~bash
[@vue/compiler-sfc] ::v-deep usage as a combinator has been deprecated. Use :deep(<inner-selector>) instead.
~~~

使用样式穿透的时候，应该使用 `:deep(类名)` 才对

~~~scss
:deep(.el-button){
  
}
~~~



### 2）Vue3 的 API 引入

vue3 的 `defineProps、defineEmits` 是内置 API，不需要进行引入

~~~bash
[@vue/compiler-sfc] `defineEmits` is a compiler macro and no longer needs to be imported.
~~~



## 5. 一键传入属性到组件，不需要提前声明

> Vue3 内置一个属性为 `$attrs`，所有没有被提前声明的属性，都会被它所收集

父组件：

~~~vue
<!-- 父组件给子组件传参 -->
<template>
    <m-menu defaultActive="1" background-color="#bfa" background-image="url(xxx)"></m-menu>
</template>
~~~

子组件接收：

+ script 里面使用 `$attrs` 则需要先进行引入 `useAttrs` 函数
+ template 里面则直接使用 `$attrs` 即可

~~~vue
<!-- 子组件没有声明background类属性 -->
<template>
	<!-- v-bind 会自动将其属性挂载到组件上面 -->
	<el-menu :default-active="defaultActive" v-bind="$attrs" class="el-menu-vertical-demo">
  </el-menu>
</template>

<script>
import { useAttrs } from 'vue'
  
let props = defineProps({
  // 默认展开的层级
  defaultActive: {
    type: String
  },
})

const $attrsInstance = useAttrs()
console.log($attrsInstance)
</script>
~~~

打印出来的信息

![image-20221226144301555](https://oss.zhishiyu.online/markdown_images/202212261443646.png)



 



# 四、学习到的新API

## 1. useSlots 

> 判断是否使用了 slot 插槽

使用方式：

~~~js
import { useSlots } from "vue"

const slots = useSlots()
console.log(slots)
~~~

没有使用 slot 插槽的内容

![image-20221224130852761](https://oss.zhishiyu.online/markdown_images/202212241308807.png) 

---

使用了匿名插槽 `<slot></slot>`

![image-20221224131001524](https://oss.zhishiyu.online/markdown_images/202212241310566.png) 

---

使用了具名插槽

![image-20221224131101648](https://oss.zhishiyu.online/markdown_images/202212241311690.png) 



## 2. scrollIntoView 滚动条跳转指定元素位置

> 参考文档：[详细介绍scrollIntoView（）方法属性_永远的新手的博客-CSDN博客_scrollintoview](https://blog.csdn.net/learn8more/article/details/108047794)

该`scrollIntoView()`方法将调用它的元素滚动到浏览器窗口的可见区域。

语法
~~~js
element.scrollIntoView（）; // 等同于element.scrollIntoView(true)
element.scrollIntoView（alignToTop）; //布尔参数
element.scrollIntoView（scrollIntoViewOptions）; //对象参数
~~~

语法参数

![image-20221228115417613](https://oss.zhishiyu.online/markdown_images/202212281154719.png) 

示例

~~~js
var element = document.getElementById("box");
 
element.scrollIntoView();
element.scrollIntoView(false);
element.scrollIntoView({block: "end"});
element.scrollIntoView({
  // 平滑滑动到元素高度
  behavior: "smooth",
})
element.scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});
~~~

## 应用场景

URL中hash标记的进化

- 聊天窗口滚动显示最新的消息
- 往一个列表添加item后滚动显示最新的添加的item
- 回到顶部(#)
- 滚动到指定位置(#xxx)



## 3. flat 数组扁平化

> 参考文章：[es6数组的flat()方法_木蓝茶陌*_*的博客-CSDN博客_flat()](https://blog.csdn.net/jyn15159/article/details/121241124)

`flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

Array.prototype.flat() 用于将嵌套的数组“扁平化”，将[二维数组](https://so.csdn.net/so/search?q=二维数组&spm=1001.2101.3001.7020)变成一维数组。该方法返回一个新数组，对原数据没有影响。

`语法`：

```js
var newArray = arr.flat([depth])
```

参数：depth 可选，指定要提取嵌套数组的结构深度，默认值为 1。

返回值：一个包含数组与子数组中所有元素的新数组。

`示例`：

~~~js
var arr1 = [
    [0, 1],
    [2, 3],
    [4, 5]
]
var arr2 = arr1.flat()
console.log(arr2)   // [0, 1, 2, 3, 4, 5]

var arr = [1, 2, [3, 4, [5, 6]]];
console.log(arr.flat());   // [1, 2, 3, 4, [5, 6]]
console.log(arr.flat(2));  // [1, 2, 3, 4, 5, 6]
~~~

使用 Infinity，可展开任意深度的嵌套数组：

~~~js
var arr3 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
console.log(arr3.flat(Infinity));  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
~~~

`flat()` 方法会移除数组中的空项：

~~~js
var arr4 = [1, 2, , 4, 5];
console.log(arr4.flat());   // [1, 2, 4, 5]
~~~



## 4. includes 查询是否存在某个值

> 参考文档：[includes()的使用场景和作用。_hello big_bear的博客-CSDN博客_includes()方法的作用是什么?](https://blog.csdn.net/big_beer/article/details/120023917)

学习
includes() 方法用于判断字符串是否包含指定的子字符串，或者判断数组中是否有指定的元素。
例如：[‘hellow’,‘world’].includes(‘hellow’) ,如果数组存在指定元素就会返回true，没有就返回false。



问题：
当在做逻辑判断的时候，发现不同状态下，会执行这个状态对应的操作，如果非常乱的时候，可以使用includes()来判断什么状态下应该执行什么样的操作。



场景：
应用场景:发送请求从后端拿到一个数据(状态),根据这个数据的数据(状态)来进行对应的操作.

~~~js
<script>
		var num = 7;//假设这是一个从后端拿到的数据，表示星期几
		if([1,3,5].includes(num)){//如果星期一、三、五吃饭堂
			console.log('吃饭堂');
		}
		else if([2,4,6].includes(num)){//如果星期二、四、六吃外卖
			console.log('吃外卖');
		}
		else{console.log('吃大餐');}//其他的就是星期日吃大餐
</script>
~~~

总结：

假设 num 是一个状态，根据这个状态来执行不同的操作。上述例子是比较简单的情况，毕竟一周只有七天，但是如果是月呢？如果一个月30天，不同的日子吃什么。这种情况下如果写逻辑判断||的话就要写很多，而使用 includes 可以写出更加简洁的代码（优雅）





# 五、声明类型

## 1. Vue3 的 defineProps 使用声明的自定义类型

使用 `vue` 提供的 `PropType` 类型来使用 ts 自定义的类型

> PropType 语法：
>
> 原生类型 as PropType<自定义类型>

~~~js
// 获取声明类型
import type { PropType } from 'vue'
import type {
  ListOptions,
  ActionOptions,
} from "../type/menu";

const props = defineProps({
  // 传递的列表数据
  list: {
    type: Array as PropType<ListOptions[]>,
    required: true, // 必填的
  },
  // 操作内容
  actions: {
    type: Array as PropType<ActionOptions[]>,
    default: () => []	// 默认的空数组
  }
})
~~~



## 2. 自定义字段范围

让一个属性只能输入规定范围内的几个值

~~~js
export interface ListItem {
	...,
  // 标签类型
  tagType?: "" | "success" | "warning" | "info" | "danger";
}

~~~

> tagType 允许的值，仅有 "" | "success" | "warning" | "info" | "danger" 可以输入，其他值都是不合法的



## 3. TS 的类型声明 - 替代 defineProps 做类型声明

### 1）普通声明

~~~js
// 定义类型
export interface ItemType {
  menuTitle: string,
  index: number,
  content: ListItem
}

const props = defineProps<{
  name: string,
  title: string,
  isDot: boolean,
  item: ItemType[]
}>()
~~~



### 2）默认值

~~~js
// withDefaults 第二个参数接收配置，可以设置默认值
withDefaults(defineProps<{
	title:string,
  arr:number[]
}>(),{
  arr: ()=> [666]		// 默认arr数组内容 
})
~~~





## 4. 如何修改数组对象的属性名（把key替换成想要的key，值不变）

> 参考文档：[如何修改数组对象的属性名（把key替换成想要的key，值不变）_小太阳...的博客-CSDN博客_把数组中对象的key 换成 另一个字段](https://blog.csdn.net/weixin_46074961/article/details/107025470)

场景： 比如后端返回给一个数组对象，但是名字不是我们想要的，我们可以修改key值变成我们想要的数组。
比如把下面的第一个数组中key值的名称改成第二个数组中key值的名称

~~~js
arr: [ { name: '小太阳', year: 18}, { name: '大太阳', year: 19}] 

brr: [ { userName: '小太阳', age: 18}, { userName: '大太阳', age: 19} ]
~~~

不使用 ts 方法：

~~~js
changeKey (arr, key) {
  let newArr = [];
  arr.forEach((item, index) => {
    let newObj = {};
    for (var i = 0; i < key.length; i++) {
      newObj[key[i]] = item[Object.keys(item)[i]]
    }
    newArr.push(newObj);
  })
  console.log(newArr)
  return newArr;
}
 
let brr= changeKey (arr, ['userName', 'age']);   //name 换 userName，year 换 age
~~~

使用 ts 方法（不明觉厉版）：

~~~js
// 替换对象中的key为其他的名字
interface ob {
  [key: string]: string
}
const changeKey = (arr: Array<ob>, key: string[]): ob[] => {
  let newArr: Array<ob> = [];
  arr.forEach((item) => {
    let newObj: ob = {};
    for (var i = 0; i < key.length; i++) {
      newObj[key[i]] = item[Object.keys(item)[i]]
    }
    newArr.push(newObj);
  })
  return newArr;
}
~~~

使用 ts 方法（Shit Mount）：

~~~js
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
~~~














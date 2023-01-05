# 一、项目初始化

## 1. 创建项目

项目根目录打开 `cmd`，输入 `npm init vue@latest`

根据配置自行选择即可，需要有的 `ts, router`



## 2. 安装依赖

~~~shell
# 组件库
npm i element-plus
# 依赖
npm i sass sass-loader -D
~~~



# 二、项目开始

## 1. 自定义 icon 

下载包：

```shell
# NPM
$ npm install @element-plus/icons-vue @wangeditor/editor
$ npm install lodash @types/lodash    # 使用的内置的 cloneDeep 深拷贝方法
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



 

## 6. 子组件暴露数据给父组件

子组件 `m-table` 使用 `defineExpose` 函数进行暴露数据，该函数不需要引入直接使用

~~~vue
<script setup lang="ts">
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
~~~

父组件使用时，通过 `ref` 获取到子组件 `m-table` 然后通过 `.value` 获取传递过来的数据

~~~vue
<tamplate>
	<m-table ref="table"></m-table>
</tamplate>

<script setup lang="ts">
  // 表格的ref
  const table = ref()
  
  // 获取表格数据
  console.log(table.value.tableDataClone[0].date);
</script>
~~~



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



## 2. useAttrs

> 用于获取父组件传递的一些没有提前声明的数据

~~~vue
<!-- 子组件 -->
<script>
	import { useAttrs } from 'vue'
  let attrs = useAttrs()

  console.log(attrs);
</script>
~~~

![image-20230103163739437](https://oss.zhishiyu.online/markdown_images/202301031637547.png) 



## 3. scrollIntoView 滚动条跳转指定元素位置

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



## 4. flat 数组扁平化

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



## 5. includes 查询是否存在某个值

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



# 六、项目上线

## 1. vite 打包全部组件

### 1）command

在根目录新建 `command` 文件夹，新建文件 `build.js` 编写 vite 和 node 代码，这段不了解，所以直接复制了

~~~js
const path = require("path");
const fsExtra = require("fs-extra");
const fs = require("fs");
const { defineConfig, build } = require("vite");
const vue = require("@vitejs/plugin-vue");
const vueJsx = require("@vitejs/plugin-vue-jsx");

const entryDir = path.resolve(__dirname, "../packages");
// const entryDir = path.resolve(__dirname, '../components')
const outputDir = path.resolve(__dirname, "../m-ui");

const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()],
});

const rollupOptions = {
  external: ["vue", "vue-router"],
  output: {
    globals: {
      vue: "Vue",
    },
  },
};

//全量构建
const buildAll = async () => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        lib: {
          entry: path.resolve(entryDir, "index.ts"),
          name: "index",
          fileName: "index",
          formats: ["es", "umd"],
        },
        outDir: outputDir,
      },
    })
  );
};

const buildSingle = async (name) => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        lib: {
          entry: path.resolve(entryDir, name),
          name: "index",
          fileName: "index",
          formats: ["es", "umd"],
        },
        outDir: path.resolve(outputDir, name),
      },
    })
  );
};

// 生成组件的 package.json 文件
const createPackageJson = (name) => {
  const fileStr = `{
  "name": "${name}",
  "version": "0.0.0",
  "main": "index.umd.js",
  "module": "index.es.js",
  "style": "style.css"
}`;

  fsExtra.outputFile(
    path.resolve(outputDir, `${name}/package.json`),
    fileStr,
    "utf-8"
  );
};

const buildLib = async () => {
  await buildAll();
  // 获取组件名称组成的数组
  const components = fs.readdirSync(entryDir).filter((name) => {
    const componentDir = path.resolve(entryDir, name);
    const isDir = fs.lstatSync(componentDir).isDirectory();
    return isDir && fs.readdirSync(componentDir).includes("index.ts");
  });

  // 循环一个一个组件构建
  for (const name of components) {
    // 构建单组件
    await buildSingle(name);

    // 生成组件的 package.json 文件
    createPackageJson(name);
  }
};

buildLib();

~~~



### 2）packages

在根目录新建 `packages` 文件夹，把 `src/components` 内容全部复制到该文件夹下，再把 `components` 组件里面使用到的 `hooks 和 utils` 方法复制到该文件夹下

如果有 `css` 文件的话，也需要复制到该文件夹下，然后在 `index.ts` 里面将 `css` 代码进行引入

![image-20230104154919404](https://oss.zhishiyu.online/markdown_images/202301041549557.png) 

并把 `packages` 文件夹里面的所有文件的引入路径，从 `@/xxx` 全部转换为 `../../` 转换为正确的路径，因为文件结构发生了变化

还需要在此新建一个文件 `vue.d.ts` 文件，写如下内容：

~~~js
declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
~~~

 ![image-20230104154742612](https://oss.zhishiyu.online/markdown_images/202301041547712.png) 



### 3）package.json 配置脚本命令

下载 `npm i fs-extra -D` 包

~~~json
"scripts": {
  "dev": "vite",
  "build": "run-p type-check build-only",
  "preview": "vite preview",
  // 新增内容
  "build:components": "node ./command/build.js",
  "lib": "npm run build:components"
},
~~~

执行 `npm run lib` 打包组件，获得如下内容

![image-20230104155651117](https://oss.zhishiyu.online/markdown_images/202301041556197.png) 



### 4）引入全局组件

在 `src/main.ts` 里面输入如下内容：

~~~js
/**
 * 全局引入打包组件
 */
import mUI from "../m-ui/index.mjs";
import "../m-ui/style.css";

app.use(mUI).mount("#app")
~~~



### 5）单独引入组件

在 `src/main.ts` 里面输入如下内容：

~~~js
/**
 * 单一引入某一打包组件
 */
import mForm from "../m-ui/form/index.mjs";
import "../m-ui/form/style.css";

app.use(mForm).mount("#app")
~~~



## 2. 发布组件库到 npm 

### 1）新建 package.json 配置

在 `m-ui` 目录下，新建 `package.json` 文件，配置如下内容：

~~~js
{
  "name": "xiaochai-element-plus-packaging",
  "version": "1.0.0",
  "main": "index.umd.js",
  "module": "index.mjs",
  "types": "index.d.ts",
  "author": {
    "name": "xiaochai"
  },
  "keywords": [
    "element-plus",
    "ts",
    "封装组件",
    "二次封装",
    "vue-components"
  ]
}
~~~

~~~js
{
  "name": "xiaochai-element-plus-packaging",
  "version": "1.0.0",	
  "main": "index.umd.js",		// 主入口
  "module": "index.mjs",		// 模块
  "types": "index.d.ts",		// 告诉别人我们是vue的一个插件
  "author": {
    "name": "xiaochai"	
  },
  "keywords": [			// 别人通过这些关键字可以搜到这个包
    "element-plus",
    "ts",
    "封装组件",
    "二次封装",
    "vue-components"
  ]
}
~~~



### 2）注册 npm 账号

1. 访问 https://www.npmjs.com/ 网站，点击 `sign up` 按钮，进入注册用户界面
2. 填写账号相关的信息：Full Name、Public Email、Username、Password
3. 点击 Create an Account 按钮，注册账号
4. 登录邮箱，点击验证链接，进行账号的验证



### 3）登录 npm 账号

npm 账号注册完成后，可以在终端中执行 `npm login` 命令，依次输入用户名、密码、邮箱后，即可登录成功

![image-20220823105652285](https://oss.zhishiyu.online/markdown_images/202301051127721.png) 

注意：

+ 在运行 `npm login` 命令之前，必须先把`下包的服务器地址`切换为 npm 的官方服务器，否则登录会失败

  ~~~bash
  # 切换到 npm 官方服务器
  nrm use npm
  
  # nrm 不存在的话先下载到全局
  npm i nrm -g
  
  # 登录完成后记得切换回去淘宝镜像
  nrm use taobao
  ~~~

+ 并且输入密码时，会看不到输入的内容，这里做了遮挡的操作，只要输进去密码了就行

+ 输入完邮箱后，会给邮箱发一个验证码，将验证码输入到 `Enter one-time password` 即可



### 4）把包发布到 npm 上

将终端切换到`包的根目录`之后，运行 `npm publish` 命令，即可将包发布到 npm 上（注意：`包名不能雷同`）

发布完成后就可以，[itachai-tools - npm (npmjs.com)](https://www.npmjs.com/package/itachai-tools) npm 上搜索到自己发布的包了

![image-20220823110423279](https://oss.zhishiyu.online/markdown_images/202301051127725.png) 



### 5）删除已发布的包

运行 `npm unpublish 包名 --force` 命令，即可从 npm 删除已发布的包

![image-20220823111143183](https://oss.zhishiyu.online/markdown_images/202301051128316.png) 

注意：

+ npm unpublish 命令只能删除 `72小时以内` 发布的包
+ npm unpublish 删除的包，在 `24小时内` 不允许重复发布
+ 发布包的时候要慎重，`尽量不要往npm上发布没有意义的包`！



### 6）测试发布的包

使用 vite 快速创建一个项目：

~~~bash
npm create vite@latest my-vue-app -- --template vue-ts
~~~

安装依赖：

~~~bash
# ElementPlus 和 icon图标包
npm install element-plus @element-plus/icons-vue

# 安装自己发布的包
npm i xiaochai-element-plus-packaging
~~~

> 此时注意
>
> 1. 如果你使用的是 npm 官方源，那么可以正常下载，因为已经发布到 npm 官方源上面了
> 2. 如果你使用的是 taobao 镜像源，那么暂时还不能下载，因为此时 taobao 还没有及时克隆最新的 npm 官方源

![image-20230105114616015](https://oss.zhishiyu.online/markdown_images/202301051146078.png) 

注册全局资源部包：

~~~js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
const app = createApp(App);

// ElementPlus 包
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 注册ElementPlus全局icon包
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

// 引入自己的组件包，并且全局注册
import mUI from "xiaochai-element-plus-packaging";
import "xiaochai-element-plus-packaging/style.css";

// 注册自己的全局 icon 组件
import { toLine } from "xiaochai-element-plus-packaging/utils/index";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(`el-icon-${toLine(key)}`, component);
}

// 挂载自己的组件和ElementPlus
app.use(ElementPlus).use(mUI).mount("#app");

~~~

单一注册自己的组件包：

~~~js
// 引入自己的组件包
import chooseIcon from "xiaochai-element-plus-packaging/chooseIcon/index";
// 有的组件有css，有的组件没有css，看情况引入
import "xiaochai-element-plus-packaging/chooseIcon/style.css";

// 挂载自己的组件和ElementPlus
app.use(ElementPlus).use(chooseIcon).mount("#app");
~~~



### 7）更新发布的组件包

将 `package.json 和 index.d.ts` 将内容复制出来，放到根目录一个叫 `demo` 的文件夹

![image-20230105124443645](https://oss.zhishiyu.online/markdown_images/202301051244705.png) 

更新 `packages/index.ts` 文件，添加如下内容：

~~~js
import { toLine } from "./utils";
// 注册ElementPlus全局icon包
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export default {
  install(app: App) {
    // 注册自己的全局 icon 组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(`el-icon-${toLine(key)}`, component);
    }
    allComponents.map((item) => app.use(item));
  },
};
~~~

更新 `command/build.js` 脚本文件：

~~~js
// 生成组件的 package.json 文件
// 生成 index.d.ts 告诉用户，我们这个组件库是一个vue插件
const createPackageJson = (name) => {
  const fileStr = `{
  "name": "${name}",
  "version": "0.0.0",
  "main": "index.umd.js",
  "module": "index.es.js",
  "style": "style.css"
}`;

  const indexDTs = `
  import { App } from "vue";
  declare const _default: {
    install(app: App): void;
  };
  export default _default;
  `;

  fsExtra.outputFile(
    path.resolve(outputDir, `${name}/package.json`),
    fileStr,
    "utf-8"
  );
  fsExtra.outputFile(
    path.resolve(outputDir, `${name}/index.d.ts`),
    indexDTs,
    "utf-8"
  );
};
~~~

执行 `npm run lib` 重新运行脚本文件，再把 `demo/index.d.ts和package.json` 放到 `m-ui` 目录下

![image-20230105125012526](https://oss.zhishiyu.online/markdown_images/202301051250588.png) 

最后将版本号更新一下即可

![image-20230105125022198](https://oss.zhishiyu.online/markdown_images/202301051250260.png) 

再次切换到 `m-ui` 终端目录下，执行 `npm run lib` 命令，更新发布的 `npm` 包



### 8）再次测试更新的组件包

重新下载组件包 `npm i xiaochai-element-plus-packaging` 

在 `main.ts` 里面重新引入文件：

~~~js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
const app = createApp(App);

// ElementPlus 包
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 引入自己的组件包
import mUI from "xiaochai-element-plus-packaging";
import "xiaochai-element-plus-packaging/style.css";

// 引入单一组件包
// import chooseIcon from "xiaochai-element-plus-packaging/chooseIcon/index";
// import "xiaochai-element-plus-packaging/chooseIcon/style.css";

// 挂载自己的组件和ElementPlus
app.use(ElementPlus).use(mUI).mount("#app");
~~~

这次优化了引入文件数量，改到了组件包里面自动引入



## 3. 部署组件的静态网站到 GitHub 或 Gitee

### 1）修改 vue 文件配置

修改路由配置从 `history` 变成 `hash` 路由

~~~js
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const router = createRouter({
  // 改成 hash 路由
  history: createWebHashHistory(import.meta.env.BASE_URL),
})

export default router;
~~~

在修改 线上 地址的 `base ` 基本路径

~~~js
// https://vitejs.dev/config/
export default defineConfig({
	...,
  base: "./",
});
~~~

构建项目 `build run npm`，打包成 `dist` 文件夹

> 如果命令运行失败，[2. 构建项目出错](#2. 构建项目出错) ，跳转这个链接查看



### 2）发布到 Github 

#### A. 发布到已有的代码仓库的一个分支上面

将打包出来的 `dist` 文件夹复制到桌面上

在 `dist` 文件夹下新开一个终端，依次执行如下命令：

~~~bash
# 初始化 git
git init

# 对所有文件进行暂存
git add .

# 进行一次提交 注意是双引号，不要写单引号
git commit -m "完成了二次组件代码的打包"
~~~

将仓库源切换到已有的代码仓库：

~~~bash
# 将当前项目的仓库修改为对应的仓库
git remote add origin https://github.com/ChaiMayor/Packaging-ElementUI
~~~

> 仓库地址获取方法：直接打开对应仓库，然后复制地址栏地址即可

 ![image-20230105134738472](https://oss.zhishiyu.online/markdown_images/202301051347557.png) 

---



现在新建一个分支：

~~~bash
# 创建一个新的分支，并指向它
git checkout -b dist 
~~~

然后推送将代码推送到远程仓库：

~~~bash
# 推送到远程仓库，-u 如果分支名不存在的话，才写
git push -u origin dist
~~~

这个时候查看 `GitHub仓库` 就会发现提交成功

![image-20230105135542099](https://oss.zhishiyu.online/markdown_images/202301051355214.png)

---



在仓库里面找到 `Settings` 设置，在左侧栏中找到 `Pages`，接着在右侧找到 `Branch` 然后选择 `dist` 分支，带你级 `Save` 保存即可

![image-20230105140018776](https://oss.zhishiyu.online/markdown_images/202301051400854.png) 

这里时候上方就会有 `蓝色的地址了`，可以通过这个地址访问 `演示项目` 了

![image-20230105140204339](https://oss.zhishiyu.online/markdown_images/202301051402413.png) 



## 4. 先快速启动一个服务，测试打包文件是否可以正常访问

使用 `http-server` 快速打开一个服务

在 `dist` 文件件下，运行执行命令：`http-server -p 端口号` 快速启动一个服务

![image-20230105142017567](https://oss.zhishiyu.online/markdown_images/202301051420654.png) 





# 七、遇到的 bug 和 错误

## 1. main.ts 里面引入 App 文件飘红

需要在根目录下的 `env.d.ts` 加上如下代码：

~~~js
/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
~~~

![image-20230105132816516](https://oss.zhishiyu.online/markdown_images/202301051328611.png) 



## 2. 构建项目出错

![image-20230105132930851](https://oss.zhishiyu.online/markdown_images/202301051329909.png) 

在 `package.json` 里面将 `build` 后面的脚本改一下

~~~js
  "scripts": {
    "dev": "vite",
    // "build": "run-p type-check build-only",
    "build": "vite build",
    "preview": "vite preview",
    "build:components": "node ./command/build.js",
    "lib": "npm run build:components"
  },
~~~

修改为：

~~~js
 "build": "vite build"
~~~



## 3. GitHub 部署页面失败

打开页面时，资源加载失败

![image-20230105152651974](https://oss.zhishiyu.online/markdown_images/202301051526096.png) 

原因：

1. 没有配置线上地址的 base 基本路径
2. 没有使用 hash 路由（像这种带有前缀的路径一定要使用 hash 路由）

解决：

1. 在 `vite.config,ts` 里面配置线上的基本路径

   ![image-20230105152914685](https://oss.zhishiyu.online/markdown_images/202301051529782.png) 

2. 变更路由为 `hash` 路由

   ![image-20230105152956643](https://oss.zhishiyu.online/markdown_images/202301051529737.png) 

> 参考文档：
>
> [共享配置 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/config/shared-options.html#base)
>
> [构建生产版本 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/guide/build.html#browser-compatibility)










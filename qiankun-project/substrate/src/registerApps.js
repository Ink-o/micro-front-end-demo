import { registerMicroApps, start, initGlobalState } from 'qiankun'

const loader = (loading) => {
  console.log('加载状态', loading);
}

// 给子应用提供一个全局状态
const actions = initGlobalState({
  name: 'jw',
  age: 30
})
// 监听全局状态更改
actions.onGlobalStateChange((newVal, oldVal) => {
  console.log('parent', newVal, oldVal);
})

debugger
registerMicroApps([
  {
    name: 'reactApp',
    entry: '//localhost:10000', // 默认 react 启动的入口
    activeRule: '/react', // 当路径是 /react 的时候启动
    container: '#container', // 应用挂载位置
    loader,
    props: {
      a: 1,
      util: {},
    }
  },
  {
    name: 'vueApp',
    entry: '//localhost:20000', // 默认 react 启动的入口
    activeRule: '/vue', // 当路径是 /react 的时候启动
    container: '#container', // 应用挂载位置
    loader,
    props: {
      a: 1,
      util: {},
    }
  },
], {
  beforeLoad() {
    console.log('beforeLoad');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  afterMount() {
    console.log('afterMount');
  },
  beforeUnmount() {
    console.log('beforeUnmount');
  },
  afterUnmount() {
    console.log('afterUnmount');
  }
})
debugger

// start({
//   sandbox: {
//     // experimentalStyleIsolation: true
//     strictStyleIsolation: true,
//   }
// })

start({
  // 开启沙箱
  sandbox: {
    // 样式隔离方案：
    // 实现了动态样式表
    // css-module,scoped 可以再打包的时候生成一个选择器的名字  增加属性 来进行隔离
    // BEM
    // CSS in js
    // shadowDOM 严格的隔离（创建了一个新的隔离环境）

    // 严格模式。创建一个 影子 DOM（缺陷：父级无法拿到子级的DOM了）
    // strictStyleIsolation: true,


    // 试验性（给所有样式都加上一个统一后缀）
    experimentalStyleIsolation: true // 缺点 就是子应用中的dom元素如果挂在到了外层，会导致样式不生效
  }
})
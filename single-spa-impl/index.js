// 微前端 就是可以加载不同的应用  基于路由的微前端

// 如何接入已经写好的应用 对于singlespa而言，我们需要改写子应用 （接入协议） bootstrap， mount， unmount
// /a  /b
import { registerApplication, start } from './single-spa/single-spa.js'
// let { registerApplication, start } = singleSpa
let app1 = {
  // 启动钩子
  bootstrap: [
    async () => console.log('app1 bootstrap1'),
    async () => console.log('app1 bootstrap2')
  ],
  // 可以在这里执行安装逻辑
  mount: [
    // 基座给子应用传递 props 共享数据
    async (props) => {
      // new Vue().$mount()...
      console.log('app1 mount1', props)
    },
    async () => {
      // new Vue().$mount()...
      console.log('app1 mount2')
    }
  ],
  // 可以在这里执行卸载逻辑
  unmount: async (props) => {
    console.log('app1 unmount')
  }
}
let app2 = {
  bootstrap: async () => console.log('app2 bootstrap1'),
  mount: [
    async () => {
      // new Vue().$mount()...
      return new Promise((resolve, reejct) => {
        setTimeout(() => {
          console.log('app2 mount')
          resolve()
        }, 1000)
      })
    }
  ],
  unmount: async () => {
    console.log('app2 unmount')
  }
}
// 当路径是#/a 的时候就加载 a应用

// 所谓的注册应用 就是看一下路径是否匹配，如果匹配则“加载”对应的应用
// 第3个数组可以接收一个 prop，数据共享
// 第2个的函数也可以接收 props 参数
registerApplication(
  'a',
  async (props) => app1,
  location => location.hash.startsWith('#/a'),
  { a: 1 }
)
registerApplication(
  'b',
  async () => app2,
  location => location.hash.startsWith('#/b'),
  { a: 1 }
)

// 开启路径的监控，路径切换的时候 可以调用对应的mount unmount
// debugger
start()


// 这个监控操作 应该被延迟到 当应用挂挂载完毕后再行
window.addEventListener('hashchange', function () {
  console.log(window.location.hash, 'p----')
})

// window.addEventListener('popstate',function(){
//     console.log(window.location.hash,'p----')
// })
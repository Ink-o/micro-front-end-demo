import './public-path'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './router/index'

let app
let history
let router
function render(props) {
  app = createApp(App)
  history = window.__POWERED_BY_QIANKUN__ ? '/vue' : '/'
  router = createRouter({
    history: createWebHistory(history),
    routes
  })
  app.use(router)
  const container = props?.container
  app.mount(container ? container.querySelector('#app') : document.getElementById('app'))
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}
export async function bootstrap(props) {
  console.log('vue-bootstrap', props);
}
// 挂载时调用的钩子
export async function mount(props) {
  // 福应用挂载时会传递 props，props 中会有挂载点
  render(props)
  console.log('vue-mount', props.container.querySelector('#root'));
}
export async function unmount(props) {
  console.log('vue-unmount', props);
  app.unmount()
  // history.destroy()
  app = null
}
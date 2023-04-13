import { reroute } from './reroute.js'

function urlRoute() {
  reroute(arguments)
}

// 对用户的路径切换进行截止
window.addEventListener('hashchange', urlRoute)
// 浏览器历史切换的时候会执行此方法
window.addEventListener('popstate', urlRoute)

const captureEventListener = {
  hashchange: [],
  popstate: []
}
const listentingTo = ['hashchange', 'popstate']
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = function (eventName, callback) {
  // 有要监听的事件，函数不能重复
  if (listentingTo.includes(eventName) && !captureEventListener[eventName].some(listener => listener === callback)) {
    return captureEventListener[eventName].push(callback)
  }
  return originalAddEventListener.apply(this, arguments)
}
window.removeEventListener = function (eventName, callback) {
  if (listentingTo.includes(eventName)) {
    captureEventListener[eventName] = captureEventListener[eventName]?.filter(fn => fn !== callback)
    return
  }
  return originalRemoveEventListener.apply(this, arguments)
}

// 调用捕获的自定义事件
// 主要为了缓存事件，等待组件加载完毕后再进行触发
export function callCaptureEventListeners(e) {
  if (e) {
    const eventType = e[0].type
    if (listentingTo.includes(eventType)) {
      captureEventListener[eventType].forEach(listener => {
        listener.apply(this, e)
      });
    }
  }
}
function patchFn(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href
    const r = updateState.apply(this, arguments)
    // 调用了 updateState 后，url 可能改变了
    const urlAfter = window.location.href

    // 当前后路径不一样时，才需要去触发 popstate
    if (urlBefore !== urlAfter) {
      // 手动派发 popstate 事件
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    return r
  }
}

// 用户调用pushState replaceState 此方法不会触发逻辑reroute，
// 所以需要对 pushState和replaceState 进行代理
window.history.pushState = patchFn(window.history.pushState, 'pushState')
window.history.replaceState = patchFn(window.history.replaceState, 'replaceState')
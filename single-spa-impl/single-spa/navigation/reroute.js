import {
  getAppChanges,
  shouldBeActive
} from '../application/app.hepler.js'
import { toBootstrapPromise } from '../lifecycles/bootstrap.js'
import { toLoadPromise } from '../lifecycles/load.js'
import { toMountPromise } from '../lifecycles/mount.js'
import { toUnmountPromise } from '../lifecycles/unmount.js'
import { started } from '../start.js'
import { callCaptureEventListeners } from './naviation-event.js'

// 后续路径变化，也需要走这里，重新计算哪些应用被加载或卸载
let appChangeUnderWay = false
let peopleWaitingOnAppChange = []
/**
 * 重新计算哪些应用被加载或卸载
 * event 是在 hashchange/popstate 的时候进行传递的
 * @param {Event} event 
 * @returns 
 */
export function reroute(event) {
  // 如果多次触发 reroute 方法我们可以创造一个队列来屏蔽这个问题
  // 直接返回一个 promise 
  if (appChangeUnderWay) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnAppChange.push({
        resolve, reject
      })
    })
  }

  // 获取app对应的状态进行分类
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges()
  // 加载完毕后，需要去挂载的应用（这里做了个区分，因为路径更改和初始化都要执行到这边）
  if (started) {
    appChangeUnderWay = true
    // 用户调用了 start 方法，我们需要处理当前应用要挂载或者卸载
    return performAppChange()
  }
  // 先拿到应用去加载
  return loadApps()

  /**
   * 应用的加载
   * @returns 
   */
  function loadApps() {
    // 这里应用加载完毕后，也是需要触发一次收集的事件
    return Promise.all(appsToLoad.map(toLoadPromise)).then(callEventListener)
  }
  /**
   * 执行app更改
   * @returns 
   */
  function performAppChange() {
    // 将不需要的应用卸载掉，返回一个卸载的 promise
    // 卸载掉所有需要卸载的应用，toUnmountPromise 接收一个 app，appsToUnmount 是需要卸载的 app
    const unmountAllPromises = Promise.all(appsToUnmount.map(toUnmountPromise))

    // 流程加载需要的应用 -> 启动对应的应用 -> 卸载之前的 -> 挂载对应的应用
    // 1. 加载对应的应用
    // 2. 安装对应的应用
    // 3. 卸载所有需要被卸载的应用
    // 4. 渲染所有需要被渲染的应用
    const loadMountPromises = Promise.all(appsToLoad.map(app => toLoadPromise(app).then(app => {
      return tryBootstrapAndMount(app, unmountAllPromises)
    })))

    // 如果应用没有加载
    const MountPromises = Promise.all(
      appsToMount.map(app => tryBootstrapAndMount(app, unmountAllPromises))
    )
    function tryBootstrapAndMount(app, unmountAllPromises) {
      if (shouldBeActive(app)) {
        // 这里先安装新应用，然后卸载掉所有的旧应用，最后再渲染所有的新应用
        // 防止出现问题
        return toBootstrapPromise(app).then(app => {
          return unmountAllPromises.then(() => {
            return toMountPromise(app)
          })
        })
      }
    }

    return Promise.all([loadMountPromises, MountPromises]).then(() => {
      // 保证应用挂载完毕后，才去触发 hashChange/popstate 事件
      callEventListener()
      appChangeUnderWay = false
      // todo：这是什么意思
      if (peopleWaitingOnAppChange.length > 0) {
        peopleWaitingOnAppChange = [] // 多次操作进行缓存
      }
    })
  }

  function callEventListener() {
    // 这里的event是外部reroute传递的
    callCaptureEventListeners(event)
  }
}
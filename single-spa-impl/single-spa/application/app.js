import { reroute } from '../navigation/reroute.js'
import { NOT_LOADED } from './app.hepler.js'

// 使用一个数组存储本次所有的应用
export const apps = []
/**
 * 
 * @param {string} appName 应用名
 * @param {function} loadApp 加载app
 * @param {function} activeWhen 什么时候active
 * @param {object} customProps 自定义props
 */
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  const registration = {
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED, // 初始状态为未加载
  }
  apps.push(registration)

  // 我们需要给每个应用添加对应的状态变化
  // 未加载 -> 加载 -> 挂载 -> 卸载

  // 需要检查哪些应用要被加载，还有哪些应用要被挂载与移除
  reroute() // 重写路由
}
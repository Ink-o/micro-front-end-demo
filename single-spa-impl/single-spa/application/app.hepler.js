import { apps } from "../application/app.js";

// app status
/**
 * 没有被加载
 */
export const NOT_LOADED = 'NOT_LOADED'
/**
 * 路径匹配了，要去加载这个资源
 */
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'
/**
 * 加载错误
 */
export const LOAD_ERROR = 'LOAD_ERROR'

// 启动的过程
/**
 * 资源加载完毕了，需要启动，此时还没启动
 */
export const NOT_BOOTSTRAPED = 'NOT_BOOTSTRAPED'
/**
 * 启动中
 */
export const BOOTSTRAPTING = 'BOOTSTRAPTING'
/**
 * 没有被挂载
 */
export const NOT_MOUNTED = 'NOT_MOUNTED'

// 挂载流程
/**
 * 正在挂载
 */
export const MOUNTING = 'MOUNTING'
/**
 * 挂载完成
 */
export const MOUNTED = 'MOUNTED'

// 卸载流程
/**
 * 卸载中
 */
export const UNMOUNTING = 'UNMOUNTING'


/**
 * 加载正在下载应用 LOADING_SOURCE_CODE，激活已经运行了
 * @param {*} app 
 * @returns 
 */
export function isActive(app) {
  return app.status = MOUNTED
}

/**
 * 当前应用是否应该被激活，调用 activeBeActive 方法来识别
 * @param {*} app 
 * @returns 
 */
export function shouldBeActive(app) {
  return app.activeWhen(window.location)
}

/**
 * 获取哪些应用应该被加载、被安装、被卸载
 * @returns {{appsToLoad: any[], appToMount: any[], appsToUnmount: any[]}}
 */
export function getAppChanges() {
  const appsToLoad = []
  const appsToMount = []
  const appsToUnmount = []

  apps.forEach((app) => {
    let appShouldBeActive = shouldBeActive(app)
    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        // 标记当前路径下，哪些应用要被加载
        if (appShouldBeActive) {
          appsToLoad.push(app)
        }
        break
      case NOT_BOOTSTRAPED:
      case BOOTSTRAPTING:
      case NOT_MOUNTED:
        // 当前路径下哪些应用要被挂载
        if (appShouldBeActive) {
          appsToMount.push(app)
        }
        break
      case MOUNTED:
        // 当前路径下哪些应用要被卸载
        if (!appShouldBeActive) {
          appsToUnmount.push(app)
        }
        break
    }
  })

  return {
    appsToLoad,
    appsToMount,
    appsToUnmount
  }
}
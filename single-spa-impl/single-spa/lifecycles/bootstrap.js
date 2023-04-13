import {
  NOT_BOOTSTRAPED,
  BOOTSTRAPTING,
  NOT_MOUNTED
} from '../application/app.hepler.js'

/**
 * app 安装，并且符合安装条件的 app 会变成 NOT_MOUNTED 状态
 * @param {*} app 
 * @returns 
 */
export function toBootstrapPromise(app) {
  if (app.status !== NOT_BOOTSTRAPED) {
    // 此应用加载完毕了
    return app
  }
  app.status = BOOTSTRAPTING
  // 未被加载的情况下，直接执行安装方法去执行加载
  return app.bootstrap(app.customProps).then(() => {
    app.status = NOT_MOUNTED
    return app
  })
}
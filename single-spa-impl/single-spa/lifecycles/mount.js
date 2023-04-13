import {
  NOT_MOUNTED,
  MOUNTED
} from '../application/app.hepler.js'

/**
 * app 安装，针对与 app 状态为 NOT_MOUNTED
 * @param app 
 * @returns 
 */
export function toMountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_MOUNTED) {
      return app
    }
    return app.mount(app.customProps).then(() => {
      app.status = MOUNTED
      return app
    })
  })
}
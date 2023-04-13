import {
  UNMOUNTING,
  NOT_MOUNTED,
  MOUNTED
} from '../application/app.hepler.js'

/**
 * app 卸载，针对与 app 状态为 MOUNTED 的
 * @param {*} app 
 * @returns 
 */
export function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== MOUNTED) {
      return app
    }
    app.status = UNMOUNTING
    return app.unmount(app.customProps).then(() => {
      app.status = NOT_MOUNTED
    })
  })
}
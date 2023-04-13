import {
  LOADING_SOURCE_CODE,
  NOT_BOOTSTRAPED,
  NOT_LOADED
} from '../application/app.hepler.js'

/**
 * 将回调数组包装成一个个的promise链式调用
 * @param {*} fns 
 * @returns 
 */
function flatternToPromise(fns) {
  fns = Array.isArray(fns) ? fns : [fns]
  return function (props) {
    return fns.reduce((rPromise, fn) => {
      return rPromise.then(() => fn(props))
    }, Promise.resolve())
  }
}

/**
 * app应用加载。执行 loadApp 钩子，对于符合状态的 app ，改变状态为 NOT_BOOTSTRAPED
 * @param {*} app 
 * @returns
 */
export function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_LOADED) {
      // 此应用加载完毕了
      return app
    }

    app.status = LOADING_SOURCE_CODE // 正在加载应用

    // loadApp 是一个 async 函数，所以可以使用 then 来进行处理
    // 并且里面返回的是应用实体
    return app.loadApp(app.customProps).then(v => {
      const {
        bootstrap,
        mount,
        unmount
      } = v
      app.status = NOT_BOOTSTRAPED
      // 将里面的 bootstrap、mount、unmount 都包装成一个 promise 数组
      app.bootstrap = flatternToPromise(bootstrap)
      app.mount = flatternToPromise(mount)
      app.unmount = flatternToPromise(unmount)

      return app
    })
  })
}
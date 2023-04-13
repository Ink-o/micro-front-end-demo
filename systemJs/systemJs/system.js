((window) => {
  const newMapUrl = {}
  // 解析 importMap
  function processScripts() {
    Array.from(document.querySelectorAll('script')).forEach(script => {
      if (script.type === 'systemjs-importmap') {
        const imports = JSON.parse(script.textContent).imports
        Object.entries(imports).forEach(([k, v]) => {
          newMapUrl[k] = v
        })
      }
    })
  }
  let lastRegister; // 最后注册的模块
  // 加载资源
  function load(id) {
    return new Promise((resolve, reject) => {
      // 创建 script 标签，并且插入到 head 中
      const script = document.createElement('script')
      script.src = newMapUrl[id] || id
      script.async = true
      document.head.appendChild(script)
      script.addEventListener('load', () => {
        // lastRegister 可能会被重置掉，所以这里需要保留一份
        // 表示资源已经加载了
        let _lastRegister = lastRegister
        lastRegister = undefined
        resolve(_lastRegister)
      })
    })
  }
  // 保存 window 的属性 Set 集合
  let windowPropSet = new Set();
  function saveGlobalProperty() {
    for (const k in window) {
      if (Object.hasOwnProperty.call(window, k)) {
        windowPropSet.add(k)
      }
    }
  }
  function getLastGlobalProperty() {
    for (const k in window) {
      if (Object.hasOwnProperty.call(window, k)) {
        if (windowPropSet.has(k)) {
          continue
        }
        // set 上没有window的属性，则就是新增的属性
        windowPropSet.add(k)
        return window[k]
      }
    }
  }
  saveGlobalProperty()
  class SystemJS {
    // 这个 id 原则上可以是一个第三方路径 cdn
    import(id) {
      return Promise.resolve(processScripts()).then(() => {
        const lastSepIndex = location.href.lastIndexOf('/')
        const baseURL = location.href.slice(0, lastSepIndex + 1)

        // 相对路径直接解析成绝对路径
        if (id.startsWith('./')) {
          return baseURL + id.slice(2)
        }
      }).then((id) => {
        // 根据文件的路径来加载资源
        let execute
        // register[0]为注册列表，register[1]为处理回调
        return load(id).then((register) => {
          const { setters, execute: exe } = register[1](() => { })
          execute = exe
          return [register[0], setters]
        }).then(([registeration, setters]) => {
          return Promise.all(registeration.map((dep, i) => {
            return load(dep).then(() => {
              // 获取新增的 window 属性，刚设置上去时，肯定不在 set 中存在
              const property = getLastGlobalProperty()
              console.log('property: ', property);
              // 加载完毕后，会在 window 上增添属性 window.React window.ReactDOM
              setters[i](property)
            })
          }))
        }).then(() => {
          execute()
        })
      })
    }
    // 注册模块
    // deps: 依赖列表
    // declare：处理函数
    register(deps, declare) {
      lastRegister = [deps, declare]
    }
  }
  window.System = new SystemJS()
  saveGlobalProperty() // 保存 window 上的属性key
})(window)
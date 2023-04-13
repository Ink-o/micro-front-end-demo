import { useRef, useEffect } from 'react'
import { startApp, destroyApp } from 'wujie'

export default function WujieReact(props) {
  const myRef = useRef(null)
  let destroy = null

  const startAppFunc = async () => {
    debugger
    destroy = await startApp({
      ...props,
      el: myRef.current
    })
  }

  useEffect(() => {
    // 启动应用
    startAppFunc()
    return () => {
      if (destroy) {
        destroyApp()
      }
    }
  })

  const { width, height } = props
  return <div style={{ width, height }} ref={myRef}></div>
}
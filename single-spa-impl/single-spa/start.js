import { reroute } from './navigation/reroute.js'

export let started = false
export function start() {
  started = true // 用户启动
  reroute()
}
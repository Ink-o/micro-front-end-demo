import { AppInterface, plugins } from '@micro-app/types'
import { fetchSource } from '../fetch'
import { isFunction, isPlainObject, logError } from '../../libs/utils'
import microApp from '../../micro_app'

export interface IHTMLLoader {
  run (app: AppInterface, successCb: CallableFunction): void
}

export class HTMLLoader implements IHTMLLoader {
  private static instance: HTMLLoader;
  public static getInstance (): HTMLLoader {
    if (!this.instance) {
      this.instance = new HTMLLoader()
    }
    return this.instance
  }

  /**
   * run logic of load and format html
   * 加载应用资源后执行 successCb 回调
   * @param successCb success callback
   * @param errorCb error callback, type: (err: Error, meetFetchErr: boolean) => void
   */
  public run (app: AppInterface, successCb: CallableFunction): void {
    const appName = app.name
    const htmlUrl = app.ssrUrl || app.url
    fetchSource(htmlUrl, appName, { cache: 'no-cache' }).then((htmlStr: string) => {
      if (!htmlStr) {
        const msg = 'html is empty, please check in detail'
        app.onerror(new Error(msg))
        return logError(msg, appName)
      }
      // 格式化 html 资源
      htmlStr = this.formatHTML(htmlUrl, htmlStr, appName)

      successCb(htmlStr, app)
    }).catch((e) => {
      logError(`Failed to fetch data from ${app.url}, micro-app stop rendering`, appName, e)
      app.onLoadError(e)
    })
  }

  /**
   * html 资源经过 plugin 处理，
   * 将 head 替换成 <micro-app-head ，
   * 将 body 替换成 <micro-app-body
   * @param htmlUrl 
   * @param htmlStr 
   * @param appName 
   * @returns 
   */
  private formatHTML(htmlUrl: string, htmlStr: string, appName: string) {
    return this.processHtml(htmlUrl, htmlStr, appName, microApp.plugins)
      .replace(/<head[^>]*>[\s\S]*?<\/head>/i, (match) => {
        return match
          .replace(/<head/i, '<micro-app-head')
          .replace(/<\/head>/i, '</micro-app-head>')
      })
      .replace(/<body[^>]*>[\s\S]*?<\/body>/i, (match) => {
        return match
          .replace(/<body/i, '<micro-app-body')
          .replace(/<\/body>/i, '</micro-app-body>')
      })
  }

  private processHtml (url: string, code: string, appName: string, plugins: plugins | undefined): string {
    if (!plugins) return code

    const mergedPlugins: NonNullable<plugins['global']> = []
    plugins.global && mergedPlugins.push(...plugins.global)
    plugins.modules?.[appName] && mergedPlugins.push(...plugins.modules[appName])

    if (mergedPlugins.length > 0) {
      return mergedPlugins.reduce((preCode, plugin) => {
        if (isPlainObject(plugin) && isFunction(plugin.processHtml)) {
          return plugin.processHtml!(preCode, url, plugin.options)
        }
        return preCode
      }, code)
    }
    return code
  }
}

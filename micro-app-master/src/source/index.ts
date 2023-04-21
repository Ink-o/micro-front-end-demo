import type { AppInterface } from '@micro-app/types'
import {
  logError,
  CompletionPath,
  pureCreateElement,
} from '../libs/utils'
import { extractLinkFromHtml, fetchLinksFromHtml } from './links'
import { extractScriptElement, fetchScriptsFromHtml, checkExcludeUrl, checkIgnoreUrl } from './scripts'
import scopedCSS from './scoped_css'

/**
 * transform html string to dom
 * @param str string dom
 */
function getWrapElement (str: string): HTMLElement {
  const wrapDiv = pureCreateElement('div')

  wrapDiv.innerHTML = str

  return wrapDiv
}

/**
 * Recursively process each child element
 * @param parent parent element
 * @param app app
 * @param microAppHead micro-app-head element
 */
function flatChildren (
  parent: HTMLElement,
  app: AppInterface,
  microAppHead: Element,
): void {
  const children = Array.from(parent.children)

  children.length && children.forEach((child) => {
    flatChildren(child as HTMLElement, app, microAppHead)
  })

  for (const dom of children) {
    if (dom instanceof HTMLLinkElement) {
      // 遇到需要排查的 url，直接替换掉
      if (dom.hasAttribute('exclude') || checkExcludeUrl(dom.getAttribute('href'), app.name)) {
        parent.replaceChild(document.createComment('link element with exclude attribute ignored by micro-app'), dom)
      } else if (!(dom.hasAttribute('ignore') || checkIgnoreUrl(dom.getAttribute('href'), app.name))) {
        extractLinkFromHtml(dom, parent, app)
      } else if (dom.hasAttribute('href')) {
        // 将 href 进行改写
        dom.setAttribute('href', CompletionPath(dom.getAttribute('href')!, app.url))
      }
    } else if (dom instanceof HTMLStyleElement) {
      if (dom.hasAttribute('exclude')) {
        parent.replaceChild(document.createComment('style element with exclude attribute ignored by micro-app'), dom)
      } else if (app.scopecss && !dom.hasAttribute('ignore')) {
        // css 进行隔离
        scopedCSS(dom, app)
      }
    } else if (dom instanceof HTMLScriptElement) {
      extractScriptElement(dom, parent, app)
    } else if (dom instanceof HTMLMetaElement || dom instanceof HTMLTitleElement) {
      parent.removeChild(dom)
    } else if (dom instanceof HTMLImageElement && dom.hasAttribute('src')) {
      // 这里的 src 也是
      dom.setAttribute('src', CompletionPath(dom.getAttribute('src')!, app.url))
    }
  }
}

/**
 * Extract link and script, bind style scope
 * 加载完html 资源到这，提取链接和脚本，绑定样式范围
 * @param htmlStr html string
 * @param app app
 */
export function extractSourceDom(htmlStr: string, app: AppInterface) {
  // 创建一个 div ，把元素内容给 inner 进去
  const wrapElement = getWrapElement(htmlStr)
  const microAppHead = wrapElement.querySelector('micro-app-head')
  const microAppBody = wrapElement.querySelector('micro-app-body')

  if (!microAppHead || !microAppBody) {
    const msg = `element ${microAppHead ? 'body' : 'head'} is missing`
    app.onerror(new Error(msg))
    return logError(msg, app.name)
  }

  // 对样式处理，增加 scopedcss
  flatChildren(wrapElement, app, microAppHead)


  // 加载 link 资源，内部还是用 fetch 来进行加载的
  // 最终转化成 style 标签插入到 micro-head 里面
  // 内部资源加载完毕后也会执行 app.onload
  if (app.source.links.size) {
    fetchLinksFromHtml(wrapElement, app, microAppHead)
  } else {
    app.onLoad(wrapElement)
  }

  // 加载 script 资源
  if (app.source.scripts.size) {
    fetchScriptsFromHtml(wrapElement, app)
  } else {
    // 走挂载逻辑
    app.onLoad(wrapElement)
  }
}

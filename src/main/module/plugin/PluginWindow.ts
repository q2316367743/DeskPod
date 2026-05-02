import { WebContentsView, BaseWindow } from 'electron'
import ews from 'electron-window-state'
import { join } from 'path'
import { pluginManager, taskbarManager } from '$/global/BeanFactory'
import { APP_DATA_DB_STATE_PLUGIN_PATH } from '$/global/Constant'
import { PluginWebviewWindowOptions, PluginWebviewOptions } from '@common/params'
import { PARTITION, TauriEvent } from '@common/global'
import icon from '../../../../resources/icon.png?asset'

interface WebviewValue {
  label: string
  parent: string
  webview: WebContentsView
}

interface WindowValue {
  label: string
  window: BaseWindow
  webview: Map<string, WebviewValue>
}

// 插件 ID => 窗口 ID => 浏览器
const pluginBrowserWindowMap = new Map<string, Map<string, WindowValue>>()
// 浏览器 ID => 浏览器
const webviewIdMap = new Map<number, { pluginId: string; parent: string; label: string }>()

// --------------------------- 获取窗口的一些封装函数 ---------------------------

export function getPluginWindowMap(pluginId: string) {
  return pluginBrowserWindowMap.get(pluginId)
}
export function getPluginWindows(pluginId: string) {
  return Array.from(pluginBrowserWindowMap.get(pluginId)?.values() || [])
}
export function getPluginWindowByLabel(pluginId: string, label: string) {
  return pluginBrowserWindowMap.get(pluginId)?.get(label)
}
export function getPluginWebviewByLabel(pluginId: string, label: string) {
  const p = pluginBrowserWindowMap.get(pluginId)
  if (p) {
    const values = Array.from(p.values())
    for (const value of values) {
      const webview = value.webview.get(label)
      if (webview) {
        return webview
      }
    }
  }
  return null
}

export function getBrowserWindowKeyById(id: number) {
  return webviewIdMap.get(id)
}

// --------------------------- 窗口相关 ---------------------------

// 关闭一个插件窗口
function closePluginWindow(pluginBw: Map<string, WindowValue>, label: string) {
  // 存在这个窗口了，先关闭
  const old = pluginBw.get(label)
  if (old) {
    old.window.close()
    pluginBw.delete(label)
  }
}

function closeOrDestroy(win: BaseWindow, timeout = 3000) {
  let closedNormally = false

  // 监听正常关闭
  win.once('closed', () => {
    closedNormally = true
    console.log('窗口正常关闭')
  })

  // 触发 close
  win.close()

  // 设置超时检查
  setTimeout(() => {
    if (!closedNormally && !win.isDestroyed()) {
      console.log('窗口未在超时内关闭，强制销毁')
      win.destroy() // 立即销毁，绕过 close 事件
    }
  }, timeout)
}

// 关闭插件全部窗口
export function closePluginAllWindow(pluginId: string): void {
  // 关闭打开的窗口
  const map = pluginBrowserWindowMap.get(pluginId)
  if (map) {
    map.forEach((win) => {
      closeOrDestroy(win.window, 5000)
    })
    pluginBrowserWindowMap.delete(pluginId)
  }
}

function attachWebviewToWindow(webview: WebContentsView, window: BaseWindow) {
  window.contentView.addChildView(webview)
  const { width, height } = window.getBounds()
  webview.setBounds({
    x: 0,
    y: 0,
    width: width,
    height: height
  })

  window.on('resize', () => {
    const { width, height } = window.getBounds()
    webview.setBounds({
      x: 0,
      y: 0,
      width: width,
      height: height
    })
  })
}

/**
 * 创建插件Webview窗口
 * @param options 窗口参数
 * @param pluginId 插件 ID
 */
export async function createPluginWebviewWindow(
  options: PluginWebviewWindowOptions,
  pluginId: string
): Promise<void> {
  if (!options.label) return Promise.reject(Error('请提供插件标签'))
  if (!options.url) return Promise.reject(Error('请提供插件地址'))
  // 先获取插件
  let pluginBw = pluginBrowserWindowMap.get(pluginId)
  if (!pluginBw) {
    pluginBw = new Map()
    pluginBrowserWindowMap.set(pluginId, pluginBw)
  }

  if (pluginBw && pluginBw.has(options.label)) {
    // 存在这个窗口了，先关闭
    closePluginWindow(pluginBw, options.label)
  }

  // 获取插件信息
  const entity = pluginManager.getById(pluginId)
  if (!entity) return Promise.reject(Error('插件未找到'))

  // 创建窗口
  const bwEws = ews({
    defaultHeight: options.height,
    defaultWidth: options.width,
    path: APP_DATA_DB_STATE_PLUGIN_PATH,
    file: `${entity.identifier}-${options.label}.json`
  })
  const iconPath = options.icon ? join(entity.root, entity.icon) : icon
  const bw = new BaseWindow({
    icon: iconPath,
    show: true,
    x: bwEws.x,
    y: bwEws.y,
    width: bwEws.width,
    height: bwEws.height,
    fullscreen: bwEws.isFullScreen,
    skipTaskbar: true
  })
  // 应该可以管理
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  bwEws.manage(bw)
  taskbarManager.manage({
    bw,
    type: 'plugin',
    icon: iconPath,
    name: `${options.label} | ${entity.productName}`
  })
  bw.once('closed', () => {
    // 被关闭了，则移除
    const old = pluginBrowserWindowMap.get(pluginId)
    if (old) {
      // 删除全部的 webview id 映射
      old.get(options.label)?.webview.forEach(({ webview }) => {
        webviewIdMap.delete(webview.webContents.id)
      })
      // 删除这个窗口
      old.delete(options.label)
    }
  })
  // 系统级事件
  bw.addListener('resize', () => bw.emit(TauriEvent.WINDOW_RESIZED))

  const windowValue: WindowValue = { label: options.parent, window: bw, webview: new Map() }
  pluginBw.set(options.parent, windowValue)

  // 创建 webview
  const wcv = new WebContentsView({
    webPreferences: {
      partition: PARTITION.PLUGIN(entity.identifier),
      preload: join(__dirname, '../preload/plugin.js'),
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false,
      devTools: options.devtools
    }
  })
  windowValue.webview.set(options.label, {
    webview: wcv,
    label: options.label,
    parent: options.parent
  })
  attachWebviewToWindow(wcv, bw)

  // 加载文件
  if (/https?:\/\//.test(options.url)) {
    await wcv.webContents.loadURL(options.url)
  } else {
    await wcv.webContents.loadFile(join(entity.root, options.url))
  }

  // 本质上是 WebContentView 的实例
  webviewIdMap.set(wcv.webContents.id, {
    pluginId: pluginId,
    parent: options.parent,
    label: options.label
  })
}

/**
 * 创建插件 Webview
 * @param options webview 参数
 * @param windowLabel 所属窗口标签
 * @param pluginId 插件 ID
 */
export async function createPluginWebview(
  options: PluginWebviewOptions,
  windowLabel: string,
  pluginId: string
) {
  if (!options.label) return Promise.reject(Error('请提供插件标签'))
  if (!options.url) return Promise.reject(Error('请提供插件地址'))
  // 先获取插件
  const pluginBw = pluginBrowserWindowMap.get(pluginId)
  if (!pluginBw) return Promise.reject(`窗口「${windowLabel}」不存在`)
  const windowValue = pluginBw.get(windowLabel)
  if (!windowValue) return Promise.reject(`窗口「${windowLabel}」未找到`)
  const entity = pluginManager.getById(pluginId)
  if (!entity) return Promise.reject(Error('插件未找到'))
  // 创建 webview
  const wcv = new WebContentsView({
    webPreferences: {
      partition: PARTITION.PLUGIN(pluginId),
      preload: join(__dirname, '../preload/plugin.js'),
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false
    }
  })
  attachWebviewToWindow(wcv, windowValue.window)
  windowValue.webview.set(options.label, {
    webview: wcv,
    label: options.label,
    parent: windowLabel
  })

  // 加载文件
  if (/https?:\/\//.test(options.url)) {
    await wcv.webContents.loadURL(options.url)
  } else {
    await wcv.webContents.loadFile(join(entity.root, options.url))
  }

  // 本质上是 WebContentView 的实例
  webviewIdMap.set(wcv.webContents.id, {
    pluginId: pluginId,
    parent: windowLabel,
    label: options.label
  })
}

import { BrowserWindow } from 'electron'
import { defineApi } from '$/types/DefineApi'
import { join } from 'path'
import { BaseDirectory, getDirectory } from '$/support/plugin-path'

interface WindowOptions {
  // 窗口标签，必填
  label: string
  // 启动的文件，必填
  url: string

  center?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  // preventOverflow?: boolean | PreventOverflowMargin
  resizable?: boolean
  title?: string
  fullscreen?: boolean
  focus?: boolean
  focusable?: boolean
  transparent?: boolean
  maximized?: boolean
  visible?: boolean
  decorations?: boolean
  alwaysOnTop?: boolean
  alwaysOnBottom?: boolean
  contentProtected?: boolean
  skipTaskbar?: boolean
  shadow?: boolean
  // theme?: Theme
  // titleBarStyle?: TitleBarStyle
  // trafficLightPosition?: LogicalPosition
  hiddenTitle?: boolean
  tabbingIdentifier?: string
  maximizable?: boolean
  minimizable?: boolean
  closable?: boolean
  // parent?: Window | WebviewWindow | string
  visibleOnAllWorkspaces?: boolean
  // windowEffects?: Effects
  // backgroundColor?: Color
  // backgroundThrottling?: BackgroundThrottlingPolicy
  javascriptDisabled?: boolean
  allowLinkPreview?: boolean
  disableInputAccessoryView?: boolean
  // scrollBarStyle?: ScrollBarStyle
}

interface BaseArgs {
  options: WindowOptions
}

enum TauriEvent {
  WINDOW_RESIZED = 'tauri://resize',
  WINDOW_MOVED = 'tauri://move',
  WINDOW_CLOSE_REQUESTED = 'tauri://close-requested',
  WINDOW_DESTROYED = 'tauri://destroyed',
  WINDOW_FOCUS = 'tauri://focus',
  WINDOW_BLUR = 'tauri://blur',
  WINDOW_SCALE_FACTOR_CHANGED = 'tauri://scale-change',
  WINDOW_THEME_CHANGED = 'tauri://theme-changed',
  WINDOW_CREATED = 'tauri://window-created',
  WEBVIEW_CREATED = 'tauri://webview-created',
  DRAG_ENTER = 'tauri://drag-enter',
  DRAG_OVER = 'tauri://drag-over',
  DRAG_DROP = 'tauri://drag-drop',
  DRAG_LEAVE = 'tauri://drag-leave'
}

// 插件 ID => 窗口 ID => 浏览器
const pluginBrowserWindowMap = new Map<string, Map<string, BrowserWindow>>()
// 浏览器 ID => 浏览器
const browserIdMap = new Map<number, { pluginId: string; label: string }>()

export function getBrowserWindowByKey(pluginId: string, label: string) {
  return pluginBrowserWindowMap.get(pluginId)?.get(label)
}

export function getBrowserWindowKeyById(id: number) {
  return browserIdMap.get(id)
}

export function getBrowserWindowById(id: number) {
  const key = browserIdMap.get(id)
  if (key) {
    const bw = pluginBrowserWindowMap.get(key.pluginId)?.get(key.pluginId)
    if (bw) {
      return bw
    }
  }
  return undefined
}

// 此处有问题，window 和 webview 不一样
export default [
  // definePlugin<BaseArgs>('plugin:window|create', async (args, _o, payload) => {
  //   const { options } = args
  //   if (!options.label) return Promise.reject(Error('请提供插件标签'))
  //   if (!options.url) return Promise.reject(Error('请提供插件地址'))
  //   // 创建窗口
  //   const bw = new BrowserWindow(options)
  //   // 加载文件
  //   await bw.loadFile(
  //     join(app.getPath('appData'), 'plugins', payload.pluginId, 'runtime', options.url)
  //   )
  //   browserWindowMap.set(`${payload.pluginId}|${options.label}`, bw)
  // }),
  defineApi<BaseArgs>('plugin:webview|create_webview_window', async (args, _o, payload) => {
    const { options } = args
    if (!options.label) return Promise.reject(Error('请提供插件标签'))
    if (!options.url) return Promise.reject(Error('请提供插件地址'))
    const pluginBw = pluginBrowserWindowMap.get(payload.pluginId)

    if (pluginBw && pluginBw.has(options.label)) {
      // 存在这个窗口了，先关闭
      const old = pluginBw.get(options.label)!
      const oldId = old.id
      old.close()
      pluginBw.delete(options.label)
      browserIdMap.delete(oldId)
    }

    // 创建窗口
    const bw = new BrowserWindow({
      ...options,
      show: true,
      webPreferences: {
        preload: join(__dirname, '../preload/plugin.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })
    bw.once('close', () => {
      bw.emit(TauriEvent.WINDOW_DESTROYED)
      // 被关闭了，则移除
      browserIdMap.delete(bw.id)
      pluginBrowserWindowMap.get(payload.pluginId)?.delete(options.label)
    })
    // 系统级事件
    bw.addListener('resize', () => bw.emit(TauriEvent.WINDOW_RESIZED))

    // 保存对象
    browserIdMap.set(bw.id, { pluginId: payload.pluginId, label: options.label })
    if (pluginBw) {
      pluginBw.set(options.label, bw)
    } else {
      const temp = new Map<string, BrowserWindow>()
      temp.set(options.label, bw)
      pluginBrowserWindowMap.set(payload.pluginId, temp)
    }

    // 加载文件
    await bw.loadFile(join(getDirectory(payload.pluginId, BaseDirectory.Runtime), options.url))
  })
]

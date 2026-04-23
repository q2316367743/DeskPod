import { BrowserWindow, WebContentsView } from 'electron'
import { join } from 'path'
import { pluginManager } from '$/global/BeanFactory'
import { getMainWindow } from '$/module/desktop'
import icon from '../../../../resources/icon.png?asset'
import { ViewOptions, WindowOptions } from '@common/types'
import { PARTITION, TauriEvent } from '@common/global'
import { logError } from '$/lib/log'

interface PbwBrowserWindow {
  type: 'BrowserWindow'
  window: BrowserWindow
}
interface PbwWebContentsView {
  type: 'WebContentsView'
  window: WebContentsView
}
type PbwValue = PbwBrowserWindow | PbwWebContentsView

// 插件 ID => 窗口 ID => 浏览器
const pluginBrowserWindowMap = new Map<string, Map<string, PbwValue>>()
// 浏览器 ID => 浏览器
const browserIdMap = new Map<number, { pluginId: string; label: string }>()

export function getBrowserWindowByKey(pluginId: string, label: string) {
  return pluginBrowserWindowMap.get(pluginId)?.get(label)
}

export function getWindowsByPluginId(pluginId: string) {
  return Array.from(pluginBrowserWindowMap.get(pluginId)?.values() || [])
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

function closeExistWindow(pluginBw: Map<string, PbwValue>, label: string) {
  // 存在这个窗口了，先关闭
  const old = pluginBw.get(label)!
  if (old.type === 'BrowserWindow') {
    try {
      const oldId = old.window.id
      old.window.close()
      browserIdMap.delete(oldId)
    } catch (e) {
      logError(`关闭插件窗口「${label}」失败`, e)
    } finally {
      pluginBw.delete(label)
    }
  } else if (old.type === 'WebContentsView') {
    try {
      const oldId = old.window.webContents.id
      browserIdMap.delete(oldId)
      old.window.webContents.close()
      getMainWindow()?.contentView.removeChildView(old.window)
    } catch (e) {
      logError(`关闭插件小部件「${label}」失败`, e)
    } finally {
      pluginBw.delete(label)
    }
  }
}

/**
 * 创建插件窗口
 * @param options 窗口参数
 * @param pluginId 插件 ID
 */
export async function createPluginWindow(options: WindowOptions, pluginId: string): Promise<void> {
  if (!options.label) return Promise.reject(Error('请提供插件标签'))
  if (!options.url) return Promise.reject(Error('请提供插件地址'))
  const pluginBw = pluginBrowserWindowMap.get(pluginId)

  if (pluginBw && pluginBw.has(options.label)) {
    // 存在这个窗口了，先关闭
    closeExistWindow(pluginBw, options.label)
  }

  // 获取插件信息
  const entity = pluginManager.getById(pluginId)
  if (!entity) return Promise.reject(Error('插件未找到'))

  // 创建窗口
  const bw = new BrowserWindow({
    ...options,
    icon: options.icon ? join(entity.root, entity.icon) : icon,
    show: true,
    webPreferences: {
      partition: PARTITION.PLUGIN(entity.identifier),
      preload: join(__dirname, '../preload/plugin.js'),
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false
    }
  })
  bw.once('close', () => {
    bw.emit(TauriEvent.WINDOW_DESTROYED)
    // 被关闭了，则移除
    browserIdMap.delete(bw.webContents.id)
    pluginBrowserWindowMap.get(pluginId)?.delete(options.label)
  })
  // 系统级事件
  bw.addListener('resize', () => bw.emit(TauriEvent.WINDOW_RESIZED))

  // 保存对象
  browserIdMap.set(bw.id, { pluginId: pluginId, label: options.label })
  if (pluginBw) {
    pluginBw.set(options.label, { type: 'BrowserWindow', window: bw })
  } else {
    const temp = new Map<string, PbwValue>()
    temp.set(options.label, { type: 'BrowserWindow', window: bw })
    pluginBrowserWindowMap.set(pluginId, temp)
  }

  // 加载文件
  await bw.loadFile(join(entity.root, 'runtime', options.url))
}

function setWindowBounds(bw: BrowserWindow, options: ViewOptions) {
  bw.setBounds({
    x: Math.round(options.x),
    y: Math.round(options.y),
    width: Math.round(options.width),
    height: Math.round(options.height)
  })
}
function setViewBounds(wcv: WebContentsView, options: ViewOptions) {
  wcv.setBounds({
    x: Math.round(options.x),
    y: Math.round(options.y),
    width: Math.round(options.width),
    height: Math.round(options.height)
  })
}

export async function createWebContentView(pluginId: string, label: string, options: ViewOptions) {
  const mainWindow = getMainWindow()
  if (!mainWindow) {
    return Promise.reject(Error('主窗口未找到'))
  }
  const plugin = pluginManager.getById(pluginId)
  if (!plugin) {
    return Promise.reject(Error('插件未找到'))
  }
  const widgets = plugin.widgets || []
  const widget = widgets.find((e) => e.label === label)
  if (!widget) {
    return Promise.reject(Error('插件中不存在该组件'))
  }

  const pluginBw = pluginBrowserWindowMap.get(pluginId)

  if (pluginBw && pluginBw.has(label)) {
    closeExistWindow(pluginBw, label)
  }

  const wcv = new WebContentsView({
    webPreferences: {
      partition: PARTITION.PLUGIN(plugin.identifier),
      preload: join(__dirname, '../preload/plugin.js'),
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false
    }
  })

  // 保存对象
  browserIdMap.set(wcv.webContents.id, { pluginId: pluginId, label: label })
  if (pluginBw) {
    pluginBw.set(label, { type: 'WebContentsView', window: wcv })
  } else {
    const temp = new Map<string, PbwValue>()
    temp.set(label, { type: 'WebContentsView', window: wcv })
    pluginBrowserWindowMap.set(pluginId, temp)
  }

  // 加载文件
  await wcv.webContents.loadFile(join(plugin.root, 'runtime', widget.path))
  setViewBounds(wcv, options)
  // 加入到窗口
  mainWindow.contentView.addChildView(wcv)
}

export async function moveWebContentView(pluginId: string, label: string, options: ViewOptions) {
  const value = getBrowserWindowByKey(pluginId, label)
  if (!value) {
    return Promise.reject(Error('插件窗口未找到'))
  }
  if (value.type === 'WebContentsView') {
    setViewBounds(value.window, options)
  } else if (value.type === 'BrowserWindow') {
    setWindowBounds(value.window, options)
  } else {
    return Promise.reject(Error('未知的窗口类型'))
  }
}

export async function removeWebContentView(pluginId: string, label: string) {
  const mainWindow = getMainWindow()
  if (!mainWindow) {
    return Promise.reject(Error('主窗口未找到'))
  }
  const pluginMap = pluginBrowserWindowMap.get(pluginId)
  if (!pluginMap) {
    return Promise.reject(Error('插件未找到'))
  }
  const value = pluginMap.get(label)
  if (!value) {
    return Promise.reject(Error('插件窗口未找到'))
  }
  if (value.type === 'WebContentsView') {
    mainWindow.contentView.removeChildView(value.window)
    value.window.webContents.close() // 重要！必须关闭底层进程
    pluginMap.delete(label)
  } else if (value.type === 'BrowserWindow') {
    value.window.close()
    pluginMap.delete(label)
  }
}

export function closePluginWindow(pluginId: string): void {
  // 关闭打开的窗口
  const map = pluginBrowserWindowMap.get(pluginId)
  if (map) {
    map.forEach((win) => {
      if (win.type === 'BrowserWindow') {
        if (!win.window.isDestroyed()) {
          win.window.destroy() // 强制关闭窗口，触发内存数据落盘
        }
      } else if (win.type === 'WebContentsView') {
        if (!win.window.webContents.isDestroyed()) {
          win.window.webContents.close()
        }
      }
    })
    pluginBrowserWindowMap.delete(pluginId)
  }
}

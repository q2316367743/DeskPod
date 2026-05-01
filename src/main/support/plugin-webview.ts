import { defineApi } from '$/global/DefineApi'
import {
  checkBasePermission,
  createPluginWindow,
  getPluginWindowByKey,
  getPluginWindowMap
} from '$/module/plugin'
import { WebviewOptions } from '@common/params'

type Color =
  | [number, number, number]
  | [number, number, number, number]
  | { red: number; green: number; blue: number; alpha: number }
  | string

function colorToHex(color: Color): string {
  let r: number, g: number, b: number
  let a: number | undefined = undefined

  if (typeof color === 'string') return color // 已经是字符串，直接返回

  if (Array.isArray(color)) {
    ;[r, g, b, a] = color
  } else {
    ;({ red: r, green: g, blue: b, alpha: a } = color)
  }

  const hex =
    '#' +
    [r, g, b]
      .map((v) => {
        const n = Math.round(v * 255)
        return n.toString(16).padStart(2, '0')
      })
      .join('')

  // 如果有 alpha 且不为 1，追加 alpha 通道
  if (a !== undefined && a < 1) {
    const alphaHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')
    return hex + alphaHex
  }

  return hex
}

export default [
  defineApi('plugin:webview|get_all_webviews', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'get-all-webviews')
    const pluginWindows = getPluginWindowMap(p.pluginId)
    if (!pluginWindows) return []
    const labels = Array.from(pluginWindows.keys())
    return labels.map((label) => ({
      label: label,
      windowLabel: label
    }))
  }),
  defineApi<{ windowLabel: string; options: WebviewOptions }>(
    'plugin:webview|create_webview',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'create-webview')
      const { windowLabel, options } = a
      await createPluginWindow(
        {
          label: windowLabel,
          url: options.url || '',
          ...options
        },
        p.pluginId
      )
    }
  ),
  defineApi<{ label: string }>('plugin:webview|webview_position', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-position')
    const label = a.label || p.label
    const pbw = getPluginWindowByKey(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
    const bounds = pbw.window.getBounds()
    return { x: bounds.x, y: bounds.y }
  }),
  defineApi<{ label: string }>('plugin:webview|webview_size', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-size')
    const label = a.label || p.label
    const pbw = getPluginWindowByKey(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
    const bounds = pbw.window.getBounds()
    return { width: bounds.width, height: bounds.height }
  }),
  defineApi<{ label: string }>('plugin:webview|webview_close', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-close')
    const label = a.label || p.label
    const pbw = getPluginWindowByKey(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
    if (pbw.type === 'BrowserWindow') {
      pbw.window.close()
    } else if (pbw.type === 'WebContentsView') {
      pbw.window.webContents.close()
    }
  }),
  defineApi<{ label: string; value: { size: { width: number; height: number } } }>(
    'plugin:webview|set_webview_size',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set--webview-size')
      const label = a.label || p.label
      const pbw = getPluginWindowByKey(p.pluginId, label)
      if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
      if (pbw.type === 'BrowserWindow') {
        pbw.window.setSize(a.value.size.width, a.value.size.height)
      } else if (pbw.type === 'WebContentsView') {
        return Promise.reject(new Error('小部件不能设置窗口大小'))
      }
    }
  ),
  defineApi<{ label: string; value: { position: { x: number; y: number } } }>(
    'plugin:webview|set_webview_position',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set-webview-position')
      const label = a.label || p.label
      const pbw = getPluginWindowByKey(p.pluginId, label)
      if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
      if (pbw.type === 'BrowserWindow') {
        pbw.window.setPosition(a.value.position.x, a.value.position.y)
      } else if (pbw.type === 'WebContentsView') {
        return Promise.reject(new Error('小部件不能设置窗口大小'))
      }
    }
  ),
  defineApi<{ label: string }>('plugin:webview|set_webview_focus', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'set-webview-focus')
    const label = a.label || p.label
    const pbw = getPluginWindowByKey(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
    if (pbw.type === 'BrowserWindow') {
      pbw.window.focus()
    } else if (pbw.type === 'WebContentsView') {
      pbw.window.webContents.focus()
    }
  }),
  defineApi<{ label: string; value: boolean }>(
    'plugin:webview|set_webview_auto_resize',
    async (_a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set-webview-auto-resize')
      // TODO: resize 貌似不支持
    }
  ),
  defineApi<{ label: string }>('plugin:webview|webview_hide', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-hide')
    const label = a.label || p.label
    const pbw = getPluginWindowByKey(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
    if (pbw.type === 'BrowserWindow') {
      pbw.window.hide()
    } else if (pbw.type === 'WebContentsView') {
      return Promise.reject(new Error('小部件无法隐藏'))
    }
  }),
  defineApi<{ label: string }>('plugin:webview|webview_show', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-show')
    const label = a.label || p.label
    const pbw = getPluginWindowByKey(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
    if (pbw.type === 'BrowserWindow') {
      pbw.window.show()
    } else if (pbw.type === 'WebContentsView') {
      return Promise.reject(new Error('小部件无法显示'))
    }
  }),
  defineApi<{ label: string; value: number }>(
    'plugin:webview|set_webview_zoom',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set-webview-zoom')
      const label = a.label || p.label
      const pbw = getPluginWindowByKey(p.pluginId, label)
      if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
      pbw.window.webContents.setZoomLevel(a.value)
    }
  ),
  defineApi<{ label: string; window: string }>('plugin:webview|reparent', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'reparent')
    // TODO: 由于不是 window + webview，所以无法实现移动 webview 到指定窗口
  }),
  defineApi('plugin:webview|clear_all_browsing_data', async () => {
    // TODO: 清除全部浏览器数据
  }),
  defineApi<{ color: Color | null }>(
    'plugin:webview|set_webview_background_color',
    async (a, _o, p) => {
      // TODO: 设置 webview 的背景颜色
      const pbw = getPluginWindowByKey(p.pluginId, p.label)
      if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
      if (a.color) {
        pbw.window.setBackgroundColor(colorToHex(a.color))
      }
    }
  )
]

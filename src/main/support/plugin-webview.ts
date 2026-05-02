import { defineApi } from '$/global/DefineApi'
import {
  checkBasePermission,
  createPluginWebview,
  createPluginWebviewWindow,
  getPluginWebviewByLabel,
  getPluginWindowByLabel,
  getPluginWindowMap
} from '$/module/plugin'
import {
  Color,
  colorToHex,
  PluginWebviewOptions,
  WebviewOptions,
  WindowOptions
} from '@common/params'

interface BaseOptions {
  parent: string
  label: string
}

type WebviewWindowOptions = Omit<WebviewOptions, 'x' | 'y' | 'width' | 'height'> &
  WindowOptions &
  BaseOptions

export default [
  defineApi('plugin:webview|get_all_webviews', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'get-all-webviews')
    const pluginWindows = getPluginWindowMap(p.pluginId)
    if (!pluginWindows) return []
    const results = new Array<{ label: string; windowLabel: string }>()

    pluginWindows.forEach((w) =>
      w.webview.forEach((webview) => {
        results.push({
          label: webview.label,
          windowLabel: webview.parent
        })
      })
    )

    return results
  }),
  defineApi<{ windowLabel: string; options: PluginWebviewOptions }>(
    'plugin:webview|create_webview',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'create-webview')
      const { windowLabel, options } = a
      await createPluginWebview(
        {
          ...options
        },
        windowLabel,
        p.pluginId
      )
    }
  ),
  defineApi<{ label: string }>('plugin:webview|webview_position', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-position')
    const label = a.label || p.label
    const pbw = getPluginWebviewByLabel(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${label} not found.`))
    const bounds = pbw.webview.getBounds()
    return { x: bounds.x, y: bounds.y }
  }),
  defineApi<{ label: string }>('plugin:webview|webview_size', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-size')
    const label = a.label || p.label
    const pbw = getPluginWebviewByLabel(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${label} not found.`))
    const bounds = pbw.webview.getBounds()
    return { width: bounds.width, height: bounds.height }
  }),
  defineApi<{ label: string }>('plugin:webview|webview_close', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-close')
    const label = a.label || p.label
    const wcv = getPluginWebviewByLabel(p.pluginId, label)
    if (!wcv) return Promise.reject(new Error(`Webview ${label} not found.`))
    wcv.webview.webContents.close()
  }),
  defineApi<{ label: string; value: { size: { width: number; height: number } } }>(
    'plugin:webview|set_webview_size',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set--webview-size')
      const label = a.label || p.label
      const wcv = getPluginWebviewByLabel(p.pluginId, label)
      if (!wcv) return Promise.reject(new Error(`Webview ${label} not found.`))
      const { x, y } = wcv.webview.getBounds()
      wcv.webview.setBounds({
        width: a.value.size.width,
        height: a.value.size.height,
        x: x,
        y: y
      })
    }
  ),
  defineApi<{ label: string; value: { position: { x: number; y: number } } }>(
    'plugin:webview|set_webview_position',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set-webview-position')
      const label = a.label || p.label
      const wcv = getPluginWebviewByLabel(p.pluginId, label)
      if (!wcv) return Promise.reject(new Error(`Webview ${label} not found.`))
      const { width, height } = wcv.webview.getBounds()
      wcv.webview.setBounds({
        x: a.value.position.x,
        y: a.value.position.y,
        width,
        height
      })
    }
  ),
  defineApi<{ label: string }>('plugin:webview|set_webview_focus', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'set-webview-focus')
    const label = a.label || p.label
    const pbw = getPluginWebviewByLabel(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${label} not found.`))
    pbw.webview.webContents.focus()
  }),
  defineApi<{ label: string; value: boolean }>(
    'plugin:webview|set_webview_auto_resize',
    async (_a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set-webview-auto-resize')
      // TODO: resize 暂不支持
    }
  ),
  defineApi<{ label: string }>('plugin:webview|webview_hide', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-hide')
    const label = a.label || p.label
    const pbw = getPluginWebviewByLabel(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${label} not found.`))
    pbw.webview.setVisible(false)
  }),
  defineApi<{ label: string }>('plugin:webview|webview_show', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'webview-show')
    const label = a.label || p.label
    const pbw = getPluginWebviewByLabel(p.pluginId, label)
    if (!pbw) return Promise.reject(new Error(`Webview ${label} not found.`))
    pbw.webview.setVisible(true)
  }),
  defineApi<{ label: string; value: number }>(
    'plugin:webview|set_webview_zoom',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:webview', 'set-webview-zoom')
      const label = a.label || p.label
      const pbw = getPluginWebviewByLabel(p.pluginId, label)
      if (!pbw) return Promise.reject(new Error(`Webview ${label} not found.`))
      pbw.webview.webContents.setZoomLevel(a.value)
    }
  ),
  defineApi<{ label: string; window: string }>('plugin:webview|reparent', async (a, _o, p) => {
    await checkBasePermission(p, 'core:webview', 'reparent')
    // 获取目标窗口
    const targetWindow = getPluginWindowByLabel(p.pluginId, a.window)
    if (!targetWindow) return Promise.reject(new Error(`Target Window ${a.window} not found.`))
    // 获取当前 webview
    const webview = getPluginWebviewByLabel(p.pluginId, a.label)
    if (!webview) return Promise.reject(new Error(`Webview ${a.label} not found.`))
    const sourceWindow = getPluginWindowByLabel(p.pluginId, webview.parent)
    if (!sourceWindow) return Promise.reject(new Error(`Source Window ${a.window} not found.`))
    // 1. 来源 window 删除 webview
    sourceWindow.window.contentView.removeChildView(webview.webview)
    sourceWindow.webview.delete(webview.label)
    // 2. 目标 window 添加 webview
    targetWindow.window.contentView.addChildView(webview.webview)
    targetWindow.webview.set(webview.label, { ...webview, parent: targetWindow.label })

    // TODO: 由于不是 window + webview，所以无法实现移动 webview 到指定窗口
  }),
  defineApi('plugin:webview|clear_all_browsing_data', async () => {
    // TODO: 清除全部浏览器数据
  }),
  defineApi<{ color: Color | null }>(
    'plugin:webview|set_webview_background_color',
    async (a, _o, p) => {
      const pbw = getPluginWebviewByLabel(p.pluginId, p.label)
      if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
      if (a.color) {
        pbw.webview.setBackgroundColor(colorToHex(a.color))
      }
    }
  ),
  defineApi<WebviewWindowOptions>('plugin:webview|create_webview_window', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'create-webview-window')
    await createPluginWebviewWindow(a, p.pluginId)
  })
]

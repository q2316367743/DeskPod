import { defineApi } from '$/global/DefineApi'
import { Color, colorToHex } from '@common/params'
import { checkBasePermission, getPluginWindowByLabel, getPluginWindowMap } from '$/module/plugin'

interface BaseArgs {
  color: Color
}

// 此处有问题，window 和 webview 不一样
export default [
  defineApi<BaseArgs>('plugin:window|set_background_color', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-background-color')
    const pbw = getPluginWindowByLabel(p.pluginId, p.label)
    if (!pbw) return Promise.reject(new Error(`Webview ${p.pluginId} not found.`))
    if (a.color) {
      pbw.window.setBackgroundColor(colorToHex(a.color))
    }
  }),
  defineApi('plugin:window|get_all_windows', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'get-all-windows')
    return Array.from(getPluginWindowMap(p.pluginId)?.keys() || [])
  })
]

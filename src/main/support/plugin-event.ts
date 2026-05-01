import { defineApi } from '$/global/DefineApi'
import { checkBasePermission, getPluginWindowByKey, getPluginWindows } from '$/module/plugin'

type EventTarget =
  | { kind: 'Any' }
  | { kind: 'AnyLabel'; label: string }
  | { kind: 'App' }
  | { kind: 'Window'; label: string }
  | { kind: 'Webview'; label: string }
  | { kind: 'WebviewWindow'; label: string }

export default [
  defineApi<{ event: string; payload: unknown }>('plugin:event|emit', async (a, _o, p) => {
    await checkBasePermission(p, 'core:event', 'emit')
    // 发送事件给所有插件窗口
    getPluginWindows(p.pluginId).forEach((w) => w.window.webContents.send(a.event, a.payload))
  }),
  defineApi<{ target: EventTarget; event: string; payload: unknown }>(
    'plugin:event|emit_to',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:event', 'emit-to')
      const { target, event, payload } = a
      if (target.kind === 'App' || target.kind === 'Any') {
        // 发送事件给所有插件窗口
        getPluginWindows(p.pluginId).forEach((w) => w.window.webContents.send(event, payload))
      } else {
        // 发送事件给指定插件窗口
        getPluginWindowByKey(p.pluginId, target.label)?.window.webContents.send(event, payload)
      }
    }
  )
]

import { ApiPayload, defineApi } from '$/global/DefineApi'
import {
  checkBasePermission,
  getPluginWebviewByLabel,
  getPluginWindowByLabel,
  getPluginWindows
} from '$/module/plugin'

type EventTarget =
  | { kind: 'Any' } // 任意 webview
  | { kind: 'App' } // 任意 webview
  | { kind: 'AnyLabel'; label: string } // 只要 label 匹配上
  | { kind: 'Window'; label: string } // 给指定窗口
  | { kind: 'Webview'; label: string } // 给指定 webview
  | { kind: 'WebviewWindow'; label: string } // 给指定 webview/window 窗口，就是 webview 和 window 的 label 都要匹配

export function pluginEventEmit(
  target: EventTarget,
  event: string,
  payload: unknown,
  p: ApiPayload
) {
  if (target.kind === 'Window') {
    // 给指定窗口的全部 webview 发送消息
    getPluginWindowByLabel(p.pluginId, target.label)?.webview.forEach(({ webview }) => {
      webview.webContents.send(event, payload)
    })
  } else if (target.kind === 'AnyLabel') {
    // 之和 label 有关
    getPluginWindows(p.pluginId).forEach((w) => {
      if (w.label === target.label) {
        // 窗口匹配到了，给这个窗口下全部 webview 发送消息
        w.webview.forEach(({ webview }) => webview.webContents.send(event, payload))
      } else {
        w.webview.forEach(({ webview, label }) => {
          // webview 匹配到了，给这个 webview 发送消息
          if (label === target.label) {
            webview.webContents.send(event, payload)
          }
        })
      }
    })
  } else if (target.kind === 'Webview') {
    getPluginWebviewByLabel(p.pluginId, target.label)?.webview.webContents.send(event, payload)
  } else if (target.kind === 'WebviewWindow') {
    const t = getPluginWebviewByLabel(p.pluginId, target.label)
    if (t) {
      if (t.label === target.label) {
        t.webview.webContents.send(event, payload)
      }
    }
  } else {
    getPluginWindows(p.pluginId).forEach((w) =>
      w.webview.forEach(({ webview }) => webview.webContents.send(event, payload))
    )
  }
}

export default [
  defineApi<{ event: string; payload: unknown }>('plugin:event|emit', async (a, _o, p) => {
    await checkBasePermission(p, 'core:event', 'emit')
    // 发送事件给所有插件窗口
    getPluginWindows(p.pluginId).forEach((w) =>
      w.webview.forEach(({ webview }) => webview.webContents.send(a.event, a.payload))
    )
  }),
  defineApi<{ target: EventTarget; event: string; payload: unknown }>(
    'plugin:event|emit_to',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:event', 'emit-to')
      await pluginEventEmit(a.target, a.event, a.payload, p)
    }
  )
]

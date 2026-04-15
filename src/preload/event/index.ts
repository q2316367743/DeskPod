import { electronAPI } from '@electron-toolkit/preload'

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

type EventName = `${TauriEvent}` | (string & Record<never, never>)

interface Types<T> {
  /** Event name */
  event: EventName
  /** Event identifier used to unlisten */
  id: number
  /** Event payload */
  payload: T
}

export type EventCallback<T> = (event: Types<T>) => void

type EventTarget =
  | { kind: 'Any' }
  | { kind: 'AnyLabel'; label: string }
  | { kind: 'App' }
  | { kind: 'Window'; label: string }
  | { kind: 'Webview'; label: string }
  | { kind: 'WebviewWindow'; label: string }

export interface ListenArgs {
  // 事件名称
  event: string
  // 监听目标
  target: EventTarget
  // 处理器 ID
  handler: string
}

export interface UnListenArgs {
  // 事件名称
  event: string
  // 处理器 ID
  eventId: string
}

export interface EmitArgs {
  event: string
  payload?: unknown
}

export interface EmitToArgs extends EmitArgs {
  target: EventTarget
}

export function supportEventlisten(
  args: ListenArgs,
  eventMap: Map<string, (...args: Array<unknown>) => Promise<unknown> | unknown>
) {
  const { event, handler } = args
  electronAPI.ipcRenderer.on(event, (_event, ...args) => {
    const func = eventMap.get(handler)
    if (func) {
      func(...args)
    }
  })
}

export function supportEventUnListen(
  args: UnListenArgs,
  eventMap: Map<string, (...args: Array<unknown>) => Promise<unknown> | unknown>
) {
  const { event, eventId } = args
  electronAPI.ipcRenderer.removeAllListeners(event)
  eventMap.delete(eventId)
}

// 事件推送消息
export function supportEventEmit(args: EmitArgs) {
  electronAPI.ipcRenderer.send('plugin:event:emit', args)
}

export function supportEventEmitTo(args: EmitToArgs) {
  electronAPI.ipcRenderer.send('plugin:event:emit', args)
}

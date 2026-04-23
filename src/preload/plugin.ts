import { contextBridge, ipcRenderer } from 'electron'
import { sep, delimiter } from 'node:path'
import { pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'
import {
  EmitArgs,
  EmitToArgs,
  ListenArgs,
  supportEventEmit,
  supportEventEmitTo,
  supportEventlisten,
  supportEventUnListen,
  UnListenArgs
} from '~/event'

const eventMap = new Map<string, (...args: Array<unknown>) => Promise<unknown> | unknown>()

const __TAURI_OS_PLUGIN_INTERNALS__ = {
  // 'linux', 'macos', 'ios', 'freebsd', 'dragonfly', 'netbsd', 'openbsd', 'solaris', 'android', 'windows'
  platform: () => {
    return 'macos'
  }
}

const __TAURI_EVENT_PLUGIN_INTERNALS__ = {
  unregisterListener(_event: string, eventId: string) {
    eventMap.delete(eventId)
  }
}

const __TAURI_INTERNALS__ = {
  /**
   * 执行指定命令
   * @param cmd  命令
   * @param args  参数
   * @param options 选项
   */
  invoke: (cmd: string, args: unknown, options: unknown) => {
    if (cmd.startsWith('plugin:event')) {
      switch (cmd) {
        case 'plugin:event|listen':
          supportEventlisten(args as ListenArgs, eventMap)
          break
        case 'plugin:event|unlisten':
          supportEventUnListen(args as UnListenArgs, eventMap)
          break
        case 'plugin:event|emit':
          supportEventEmit(args as EmitArgs)
          break
        case 'plugin:event|emit_to':
          supportEventEmitTo(args as EmitToArgs)
          break
      }
      return Promise.resolve()
    }
    // 直接执行命令
    return ipcRenderer.invoke('plugin:cmd', {
      cmd: cmd,
      args: args,
      options: options
    })
  },
  /**
   * 注册回调
   * @param callback  回调函数
   * @param once  是否只执行一次
   * @return 事件 ID
   */
  transformCallback: (
    callback: (...args: Array<unknown>) => Promise<unknown> | unknown,
    once: boolean
  ): string => {
    const id = randomUUID()
    eventMap.set(id, (...args) => {
      if (once) {
        eventMap.delete(id)
      }
      return Promise.resolve(callback(args))
    })
    return id
  },
  convertFileSrc(filePath: string) {
    return pathToFileURL(filePath).href
  },
  metadata: {
    currentWindow: {
      // TODO：重点
      label: ''
    }
  },
  plugins: {
    path: {
      delimiter: delimiter,
      sep: sep
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('__TAURI_OS_PLUGIN_INTERNALS__', __TAURI_OS_PLUGIN_INTERNALS__)
    contextBridge.exposeInMainWorld('isTauri', true)
    contextBridge.exposeInMainWorld('__TAURI_INTERNALS__', __TAURI_INTERNALS__)
    contextBridge.exposeInMainWorld(
      '__TAURI_EVENT_PLUGIN_INTERNALS__',
      __TAURI_EVENT_PLUGIN_INTERNALS__
    )
  } catch (error) {
    console.error(error)
  }
} else {
  window.__TAURI_OS_PLUGIN_INTERNALS__ = __TAURI_OS_PLUGIN_INTERNALS__
  window.__TAURI_INTERNALS__ = __TAURI_INTERNALS__
  window.isTauri = true
  window.__TAURI_EVENT_PLUGIN_INTERNALS__ = __TAURI_EVENT_PLUGIN_INTERNALS__
}

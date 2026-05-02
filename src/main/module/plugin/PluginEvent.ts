import sql from '$/support/plugin-sql'
import path from '$/support/plugin-path'
import opener from '$/support/plugin-opener'
import dialog from '$/support/plugin-dialog'
import fs from '$/support/plugin-fs'
import store from '$/support/plugin-store'
import win from '$/support/plugin-window'
import pluginApp from '$/support/plugin-app'
import log from '$/support/plugin-log'
import shell from '$/support/plugin-shell'
import event from '$/support/plugin-event'
import webview from '$/support/plugin-webview'
import pluginWindow from '$/support/plugin-window'

// import event from './plugins/plugin-event'
import { ApiFunc } from '$/global/DefineApi'
import { ipcMain } from 'electron'
import { pluginManager } from '$/global/BeanFactory'
import { getBrowserWindowKeyById } from '$/module/plugin'
import { logError } from '$/lib/log'

// 事件处理器
const invokeHandleMap = new Map<string, ApiFunc<unknown, unknown, unknown>>()
const handleList = [
  ...sql,
  ...path,
  ...opener,
  ...dialog,
  ...fs,
  ...store,
  ...win,
  ...pluginApp,
  ...log,
  ...shell,
  ...event,
  ...webview,
  ...pluginWindow
]
handleList.flatMap(({ cmd, plugin }) => {
  invokeHandleMap.set(cmd, plugin as ApiFunc<unknown, unknown, unknown>)
})

// 接收命令
ipcMain.handle('plugin:cmd', (event, props) => {
  const { cmd, args, options } = props
  const handle = invokeHandleMap.get(cmd)
  if (handle) {
    // TODO: 获取插件
    // 发送者 ID
    const senderId = event.sender.id
    // 根据发送者 ID 拿到插件相关信息
    const bwk = getBrowserWindowKeyById(senderId)
    if (!bwk) return Promise.reject(Error('未找到窗口信息，请关闭窗口后重新打开。'))
    const entity = pluginManager.getById(bwk.pluginId)
    if (!entity) return Promise.reject(Error('未找到插件信息，请关闭窗口后重新打开。'))
    return handle(args, options, {
      pluginId: bwk.pluginId,
      parent: bwk.parent,
      label: bwk.label,
      entity: entity
    })
  }
  logError('Unknown command', cmd)
  return Promise.reject(new Error('Unknown command: ' + cmd))
})

// 接收 app 初始化事件
ipcMain.on('plugin:init', (event) => {
  event.returnValue = getBrowserWindowKeyById(event.sender.id)
})

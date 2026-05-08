import { contextBridge } from 'electron'
import {
  dbAPI,
  desktopAPI,
  pluginAPI,
  supportAPI,
  quickAPI,
  settingAPI,
  logAPI,
  taskbarAPI
} from '~/provide'

// 暴露到渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('desktopAPI', desktopAPI)
    contextBridge.exposeInMainWorld('pluginAPI', pluginAPI)
    contextBridge.exposeInMainWorld('supportAPI', supportAPI)
    contextBridge.exposeInMainWorld('quickAPI', quickAPI)
    contextBridge.exposeInMainWorld('settingAPI', settingAPI)
    contextBridge.exposeInMainWorld('logAPI', logAPI)
    contextBridge.exposeInMainWorld('taskbarAPI', taskbarAPI)
    contextBridge.exposeInMainWorld('dbAPI', dbAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  window.desktopAPI = desktopAPI
  window.pluginAPI = pluginAPI
  window.supportAPI = supportAPI
  window.quickAPI = quickAPI
  window.settingAPI = settingAPI
  window.logAPI = logAPI
  window.taskbarAPI = taskbarAPI
  window.dbAPI = dbAPI
}

// 重新导出 electronAPI 供其他模块使用
export { electronAPI } from '@electron-toolkit/preload'

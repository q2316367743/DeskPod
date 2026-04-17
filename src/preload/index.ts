import { contextBridge } from 'electron'
import { desktopAPI, pluginAPI, supportAPI, quickAPI } from '~/provide'

// 暴露到渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('desktopAPI', desktopAPI)
    contextBridge.exposeInMainWorld('pluginAPI', pluginAPI)
    contextBridge.exposeInMainWorld('supportAPI', supportAPI)
    contextBridge.exposeInMainWorld('quickAPI', quickAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  window.desktopAPI = desktopAPI
  window.pluginAPI = pluginAPI
  window.supportAPI = supportAPI
  window.quickAPI = quickAPI
}

// 重新导出 electronAPI 供其他模块使用
export { electronAPI } from '@electron-toolkit/preload'

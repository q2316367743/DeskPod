import { contextBridge } from 'electron'
import { desktopAPI } from '~/provide/desktop'
import { pluginAPI } from '~/provide/plugin'

// 暴露到渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('desktopAPI', desktopAPI)
    contextBridge.exposeInMainWorld('pluginAPI', pluginAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  window.desktopAPI = desktopAPI
  window.pluginAPI = pluginAPI
}

// 重新导出 electronAPI 供其他模块使用
export { electronAPI } from '@electron-toolkit/preload'

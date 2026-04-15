import { contextBridge, ipcRenderer } from 'electron'
import { DesktopNode } from '@common/types/DesktopNode'

// 桌面管理相关 IPC 调用
export const desktopAPI = {
  // 获取桌面节点树
  getTree: (desktopId?: string): Promise<DesktopNode[]> => {
    return ipcRenderer.invoke('desktop:getTree', desktopId)
  },

  // 新增/更新节点
  updateNode: (node: DesktopNode): Promise<DesktopNode> => {
    return ipcRenderer.invoke('desktop:updateNode', node)
  },

  // 批量更新节点
  updateNodes: (nodes: DesktopNode[]): Promise<DesktopNode[]> => {
    return ipcRenderer.invoke('desktop:updateNodes', nodes)
  },

  // 删除节点
  deleteNode: (nodeId: string): Promise<string[]> => {
    return ipcRenderer.invoke('desktop:deleteNode', nodeId)
  },

  // 获取桌面列表
  getDesktops: (): Promise<Array<{ id: string; name: string }>> => {
    return ipcRenderer.invoke('desktop:getDesktops')
  },

  // 创建桌面
  createDesktop: (desktopId: string, name: string): Promise<{ id: string; name: string }> => {
    return ipcRenderer.invoke('desktop:createDesktop', desktopId, name)
  },

  // 删除桌面
  deleteDesktop: (desktopId: string): Promise<boolean> => {
    return ipcRenderer.invoke('desktop:deleteDesktop', desktopId)
  },

  // 打开应用或链接
  openApp: (node: DesktopNode): Promise<boolean> => {
    return ipcRenderer.invoke('desktop:openApp', node)
  },

  // 获取已安装应用列表
  getInstalledApps: (): Promise<Array<{ name: string; path: string; icon?: string }>> => {
    return ipcRenderer.invoke('desktop:getInstalledApps')
  },

  // 获取网站图标
  fetchFavicon: (url: string): Promise<{ success: boolean; icon: string }> => {
    return ipcRenderer.invoke('desktop:fetchFavicon', url)
  }
}

// 暴露到渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('desktopAPI', desktopAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  window.desktopAPI = desktopAPI
}

// 重新导出 electronAPI 供其他模块使用
export { electronAPI } from '@electron-toolkit/preload'

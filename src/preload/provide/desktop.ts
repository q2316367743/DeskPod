// 桌面管理相关 IPC 调用
import { ipcRenderer } from 'electron'
import { DesktopNode, DesktopWorkspace } from '@common/types'
import { SYSTEM_EVENT } from '@common/global'
import { DesktopCreateParam, ViewOptions } from '@common/params'

export const desktopAPI = {
  onChange: (callback: () => void) => {
    ipcRenderer.on(SYSTEM_EVENT.DESKTOP_CHANGE, callback)
    return () => {
      ipcRenderer.off(SYSTEM_EVENT.DESKTOP_CHANGE, callback)
    }
  },
  // 获取桌面节点树
  getTree: (desktopId?: string): Promise<DesktopNode[]> => {
    return ipcRenderer.invoke('desktop:getTree', desktopId)
  },

  getNode: (id: string): Promise<DesktopNode | undefined> => {
    return ipcRenderer.invoke('/desktop/node/get', id)
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
  getDesktops: (): Promise<Array<DesktopWorkspace>> => {
    return ipcRenderer.invoke('desktop:getDesktops')
  },

  // 创建桌面
  createDesktop: (data: DesktopWorkspace): Promise<DesktopWorkspace> => {
    return ipcRenderer.invoke('desktop:createDesktop', data)
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
  },

  widgetCreate: (pluginId: string, label: string, options: ViewOptions) => {
    return ipcRenderer.invoke('/desktop/widget/create', pluginId, label, options)
  },

  widgetMove: (pluginId: string, label: string, options: ViewOptions) => {
    return ipcRenderer.invoke('/desktop/widget/move', pluginId, label, options)
  },

  widgetDelete: (pluginId: string, label: string) => {
    return ipcRenderer.invoke('/desktop/widget/delete', pluginId, label)
  },

  contextmenuCreateDesktop(param: DesktopCreateParam): Promise<void> {
    return ipcRenderer.invoke('/desktop/contextmenu/create/desktop', param)
  },
  contextmenuCreateNode(nodeId: string, x: number, y: number): Promise<void> {
    return ipcRenderer.invoke('/desktop/contextmenu/create/node', nodeId, x, y)
  },

  nodeAppList(): Promise<Array<{ id: string; name: string; path: string; icon: string }>> {
    return ipcRenderer.invoke('/desktop/node/app/list')
  }
}

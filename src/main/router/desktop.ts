import { ipcMain } from 'electron'
import { DesktopNode, ViewOptions } from '@common/types'
import { openApp } from '$/global/OpenApp'
import { desktopManager } from '$/global/BeanFactory'
import { createWebContentView, moveWebContentView, removeWebContentView } from '$/module/plugin'

const DEFAULT_DESKTOP_ID = 'desktop-1'

// 获取指定桌面的完整树结构
ipcMain.handle('desktop:getTree', (_event, desktopId: string = DEFAULT_DESKTOP_ID) => {
  return desktopManager.list(desktopId)
})

// 新增/更新节点
ipcMain.handle('desktop:updateNode', (_event, node: DesktopNode) => {
  return desktopManager.updateNode(node)
})

// 批量更新节点
ipcMain.handle('desktop:updateNodes', (_event, nodes: DesktopNode[]) => {
  return desktopManager.updateNodes(nodes)
})

// 删除节点（递归删除子节点）
ipcMain.handle('desktop:deleteNode', (_event, nodeId: string) => {
  return desktopManager.deleteNode(nodeId)
})

// 获取所有桌面列表
ipcMain.handle('desktop:getDesktops', () => {
  return desktopManager.getDesktops()
})

// 新增桌面
ipcMain.handle('desktop:createDesktop', (_event, desktopId: string, name: string) => {
  return desktopManager.createDesktop(desktopId, name)
})

// 删除桌面
ipcMain.handle('desktop:deleteDesktop', (_event, desktopId: string) => {
  return desktopManager.deleteDesktop(desktopId)
})

// 打开应用
ipcMain.handle('desktop:openApp', async (_event, node) => {
  return openApp(node)
})

// 获取应用列表（从系统获取已安装应用）
ipcMain.handle('desktop:getInstalledApps', () => {
  // 预留接口，后续可根据平台实现
  return []
})

// 获取网站图标
ipcMain.handle('desktop:fetchFavicon', async (_event, url: string) => {
  return desktopManager.fetchFavicon(url)
})

ipcMain.handle(
  '/desktop/widget/create',
  async (_event, pluginId: string, label: string, options: ViewOptions) => {
    return createWebContentView(pluginId, label, options)
  }
)

ipcMain.handle(
  '/desktop/widget/move',
  async (_event, pluginId: string, label: string, options: ViewOptions) => {
    return moveWebContentView(pluginId, label, options)
  }
)
ipcMain.handle('/desktop/widget/delete', async (_event, pluginId: string, label) => {
  return removeWebContentView(pluginId, label)
})

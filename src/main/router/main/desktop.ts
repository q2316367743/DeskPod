import { ipcMain, shell, app, BrowserWindow } from 'electron'
import fs from 'fs'
import path, { join } from 'path'
import { DesktopNode } from '@common/types/DesktopNode'
import { is } from '@electron-toolkit/utils'

const DEFAULT_DESKTOP_ID = 'desktop-1'

// 数据文件路径
const getDataPath = () => {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, 'desktop_data.json')
}

// 读取数据
const readData = (): { nodes: DesktopNode[]; desktops: Array<{ id: string; name: string }> } => {
  try {
    const dataPath = getDataPath()
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Failed to read desktop data:', e)
  }
  return { nodes: [], desktops: [] }
}

// 写入数据
const writeData = (data: {
  nodes: DesktopNode[]
  desktops: Array<{ id: string; name: string }>
}) => {
  try {
    const dataPath = getDataPath()
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error('Failed to write desktop data:', e)
  }
}

// 获取指定桌面的完整树结构
ipcMain.handle('desktop:getTree', (_event, desktopId: string = DEFAULT_DESKTOP_ID) => {
  const { nodes: allNodes } = readData()

  // 1. 过滤出当前桌面的节点
  return allNodes.filter((n) => n.desktopId === desktopId)
})

// 新增/更新节点
ipcMain.handle('desktop:updateNode', (_event, node: DesktopNode) => {
  const data = readData()
  const index = data.nodes.findIndex((n) => n.id === node.id)

  if (index >= 0) {
    // 更新现有节点
    data.nodes[index] = { ...data.nodes[index], ...node }
  } else {
    // 新增节点
    data.nodes.push(node)
  }

  writeData(data)
  return node
})

// 批量更新节点
ipcMain.handle('desktop:updateNodes', (_event, nodes: DesktopNode[]) => {
  const data = readData()

  for (const newNode of nodes) {
    const index = data.nodes.findIndex((n) => n.id === newNode.id)
    if (index >= 0) {
      data.nodes[index] = { ...data.nodes[index], ...newNode }
    } else {
      data.nodes.push(newNode)
    }
  }

  writeData(data)
  return nodes
})

// 删除节点（递归删除子节点）
ipcMain.handle('desktop:deleteNode', (_event, nodeId: string) => {
  const data = readData()

  // 递归收集所有要删除的ID
  const idsToDelete: string[] = [nodeId]

  function collectChildren(parentId: string) {
    const children = data.nodes.filter((n) => n.parentId === parentId)
    for (const child of children) {
      idsToDelete.push(child.id)
      if (child.type === 'folder') {
        collectChildren(child.id)
      }
    }
  }

  collectChildren(nodeId)

  data.nodes = data.nodes.filter((n) => !idsToDelete.includes(n.id))
  writeData(data)

  return idsToDelete
})

// 获取所有桌面列表
ipcMain.handle('desktop:getDesktops', () => {
  const { nodes: allNodes, desktops } = readData()
  const desktopIds = [...new Set(allNodes.map((n) => n.desktopId))]
  if (desktopIds.length === 0) {
    return [{ id: DEFAULT_DESKTOP_ID, name: '桌面 1' }]
  }
  // 合并已保存的桌面名称
  const desktopMap = new Map(desktops.map((d) => [d.id, d.name]))
  return desktopIds.map((id, index) => ({
    id,
    name: desktopMap.get(id) || `桌面 ${index + 1}`
  }))
})

// 新增桌面
ipcMain.handle('desktop:createDesktop', (_event, desktopId: string, name: string) => {
  const data = readData()
  data.desktops.push({ id: desktopId, name })
  writeData(data)
  return { id: desktopId, name }
})

// 删除桌面
ipcMain.handle('desktop:deleteDesktop', (_event, desktopId: string) => {
  const data = readData()

  // 删除该桌面的所有节点
  data.nodes = data.nodes.filter((n) => n.desktopId !== desktopId)

  // 删除桌面记录
  data.desktops = data.desktops.filter((d) => d.id !== desktopId)

  writeData(data)
  return true
})

// 打开应用
ipcMain.handle('desktop:openApp', async (_event, node: DesktopNode) => {
  if (node.type === 'app' && node.meta?.executablePath) {
    await shell.openPath(node.meta.executablePath)
    return true
  }
  if (node.type === 'link' && node.meta?.url) {
    if (node.meta?.openWith === 'inner') {
      const bw = new BrowserWindow({
        title: node.name,
        width: node.meta?.width,
        height: node.meta?.height
      })
      await bw.loadURL(node.meta.url)
      return true
    }
    await shell.openExternal(node.meta.url)
    return true
  }
  if (node.type === 'builtin') {
    const builtinWindow = new BrowserWindow({
      title: node.name,
      width: node.meta?.width || 800,
      height: node.meta?.height || 600,
      show: true,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        webSecurity: false
      }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      await builtinWindow.loadURL(
        `${process.env['ELECTRON_RENDERER_URL']}/${node.meta?.builtinId}.html`
      )
    } else {
      await builtinWindow.loadFile(join(__dirname, `../renderer/${node.meta?.builtinId}.html`))
    }
  }
  return false
})

// 获取应用列表（从系统获取已安装应用）
ipcMain.handle('desktop:getInstalledApps', () => {
  // 预留接口，后续可根据平台实现
  return []
})

// 获取网站图标
ipcMain.handle('desktop:fetchFavicon', async (_event, url: string) => {
  try {
    const urlObj = new URL(url)
    const faviconUrl = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
    return { success: true, icon: faviconUrl }
  } catch {
    return { success: false, icon: '' }
  }
})

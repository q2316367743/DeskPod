// main.js (主进程 IPC 处理)
import Store from 'electron-store'
import { ipcMain } from 'electron'
import { DesktopNode } from '@common/types/DesktopNode' // 推荐用这个库管理 JSON，或者手写 fs 读写
const store = new Store({ name: 'desktop_data' })

// 获取指定桌面的完整树结构
ipcMain.handle('desktop:getTree', (_event, desktopId) => {
  const allNodes = store.get('nodes', []) as Array<DesktopNode>

  // 1. 过滤出当前桌面的节点
  const desktopNodes = allNodes.filter((n) => n.desktopId === desktopId)

  // 2. 构建树 (递归或迭代)
  function buildTree(parentId: string | null) {
    return desktopNodes
      .filter((n) => n.parentId === parentId)
      .sort((a, b) => a.sortIndex - b.sortIndex)
      .map((node) => {
        if (node.type === 'folder') {
          return { ...node, children: buildTree(node.id) }
        }
        return node
      })
  }

  // 返回结构：{ widgets: [...], items: [文件夹树...] }
  return {
    widgets: desktopNodes.filter((n) => n.type === 'widget'),
    items: buildTree(null) // 根节点
  }
})

// 通用的增删改接口
ipcMain.handle('desktop:updateNode', (event, nodeId, newData: DesktopNode) => {
  // 找到节点，合并数据，保存回文件
  // 触发前端更新
})

ipcMain.handle('desktop:deleteNode', (event, nodeId) => {
  // 递归删除子节点（如果是文件夹），保存回文件
})

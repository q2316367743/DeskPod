import { defineStore } from 'pinia'
import { DesktopNode } from '@common/types'
import { logDebug } from '@/lib/log'

const DEFAULT_DOCK_ID = 'dock'

export const useDesktopNodeStore = defineStore('desktop-node', () => {
  const desktopId = ref('desktop-1')

  const nodes = ref(new Array<DesktopNode>())
  const dockNodes = ref(new Array<DesktopNode>())

  const init = async () => {
    logDebug('初始化节点')
    nodes.value = await window.desktopAPI.getTree(desktopId.value)
    dockNodes.value = await window.desktopAPI.getTree(DEFAULT_DOCK_ID)
  }

  window.desktopAPI.onChange(init)

  const move = async (nodeId: string, x: number, y: number, w?: number, h?: number) => {
    for (const node of nodes.value) {
      if (node.id === nodeId) {
        node.x = x
        node.y = y
        node.column = w || node.column
        node.row = h || node.row
        await window.desktopAPI.updateNode(toRaw(node))
        await init()
        return
      }
    }
  }

  const drop = async (nodeId: string, parentId: string | null, x: number, y: number) => {
    for (const node of nodes.value) {
      if (node.id === nodeId) {
        if (!node.meta) {
          node.meta = {}
        }
        node.parentId = parentId
        node.x = x
        node.y = y
        await window.desktopAPI.updateNode(toRaw(node))
        await init()
        return
      }
    }
  }

  return {
    nodes,
    dockNodes,
    desktopId,
    init,
    move,
    drop
  }
})

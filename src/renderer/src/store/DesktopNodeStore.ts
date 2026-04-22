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

  const move = async (nodeId: string, column: number, row: number, w?: number, h?: number) => {
    for (const node of nodes.value) {
      if (node.id === nodeId) {
        node.column = column
        node.row = row
        node.meta.width = w || node.meta.width
        node.meta.height = h || node.meta.height
        await window.desktopAPI.updateNode(toRaw(node))
        await init()
        return
      }
    }
  }

  const drop = async (nodeId: string, parentId: string | null, column: number, row: number) => {
    for (const node of nodes.value) {
      if (node.id === nodeId) {
        if (!node.meta) {
          node.meta = {}
        }
        node.parentId = parentId
        node.column = column
        node.row = row
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

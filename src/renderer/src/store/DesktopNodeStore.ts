import { defineStore } from 'pinia'
import { DesktopNode, DesktopWorkspace } from '@common/types'
import { useSnowflake } from '@common/utils'

export const useDesktopNodeStore = defineStore('desktop-node', () => {
  const desktopId = ref('default')

  const nodes = ref(new Array<DesktopNode>())
  const dockNodes = ref(new Array<DesktopNode>())
  const workspaces = ref(new Array<DesktopWorkspace>())

  watch(desktopId, async (val) => {
    nodes.value = await window.desktopAPI.getTree(val)
  })

  const initWorkspace = async () => {
    workspaces.value = await window.desktopAPI.getDesktops()
  }
  const initNodes = async () => {
    nodes.value = await window.desktopAPI.getTree(desktopId.value)
  }

  const init = async () => {
    await Promise.all([initWorkspace(), initNodes()])
  }

  window.desktopAPI.onChange(initNodes)

  const addWorkspace = async (data: Omit<DesktopWorkspace, 'id'>) => {
    await window.desktopAPI.createDesktop({ ...data, id: useSnowflake().nextId() })
    await initWorkspace()
  }

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
        if (node.column > 1 || node.row > 1) {
          return false
        }
        if (!node.meta) {
          node.meta = {}
        }
        node.parentId = parentId
        node.x = x
        node.y = y
        await window.desktopAPI.updateNode(toRaw(node))
        await init()
        return true
      }
    }
    return false
  }

  return {
    nodes,
    dockNodes,
    desktopId,
    workspaces,
    init,
    move,
    drop,
    addWorkspace
  }
})

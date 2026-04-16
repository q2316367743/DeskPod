import { defineStore } from 'pinia'
import { DesktopNode } from '@common/types/DesktopNode'

const DEFAULT_DOCK_ID = 'dock'

export const useDesktopNodeStore = defineStore('desktop-node', () => {
  const desktopId = ref('desktop-1')

  const nodes = ref(new Array<DesktopNode>())
  const dockNodes = ref(new Array<DesktopNode>())

  const init = async () => {
    nodes.value = await window.desktopAPI.getTree(desktopId.value)
    dockNodes.value = await window.desktopAPI.getTree(DEFAULT_DOCK_ID)
  }

  return {
    nodes,
    dockNodes,
    desktopId,
    init
  }
})

import { useDesktopNodeStore } from '@/store'

export function handleDesktopGridCxt(
  e: MouseEvent,
  column: number,
  row: number,
  parentId: string | null,
  nodeId = ''
) {
  e.preventDefault()
  e.stopPropagation()
  return window.desktopAPI.contextmenuCreateDesktop({
    desktopId: useDesktopNodeStore().desktopId,
    x: e.x,
    y: e.y,
    nodeY: row,
    nodeX: column,
    parentId,
    nodeId: nodeId
  })
}

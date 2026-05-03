import { useDesktopNodeStore } from '@/store'

export function handleDesktopGridCxt(
  e: MouseEvent,
  column: number,
  row: number,
  parentId: string | null
) {
  e.preventDefault()
  e.stopPropagation()
  return window.desktopAPI.contextmenuCreateDesktop({
    desktopId: useDesktopNodeStore().desktopId,
    x: e.x,
    y: e.y,
    nodeY: column,
    nodeX: row,
    parentId,
    nodeId: ''
  })
}

export function handleDesktopDockCxt(e: MouseEvent, column: number, row: number) {
  e.preventDefault()
  e.stopPropagation()
  return window.desktopAPI.contextmenuCreateDesktop({
    desktopId: 'dock',
    x: e.x,
    y: e.y,
    nodeY: column,
    nodeX: row,
    parentId: null,
    nodeId: ''
  })
}

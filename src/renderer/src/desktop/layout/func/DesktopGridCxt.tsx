import { useDesktopNodeStore } from '@/store'

export function handleDesktopGridCxt(e: MouseEvent, column: number, row: number) {
  e.preventDefault()
  e.stopPropagation()
  window.desktopAPI.contextmenuCreateDesktop(useDesktopNodeStore().desktopId, e.x, e.y, column, row)
}

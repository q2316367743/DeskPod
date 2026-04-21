import { DesktopNode } from '@common/types'

export function handleDesktopNodeCxt(e: MouseEvent, node: DesktopNode) {
  e.preventDefault()
  e.stopPropagation()
  window.desktopAPI.contextmenuCreateNode(node.id, e.x, e.y)
}

import { DesktopNode } from '@common/types/DesktopNode'

interface DesktopAPI {
  getTree: (desktopId?: string) => Promise<DesktopNode[]>
  updateNode: (node: DesktopNode) => Promise<DesktopNode>
  updateNodes: (nodes: DesktopNode[]) => Promise<DesktopNode[]>
  deleteNode: (nodeId: string) => Promise<string[]>
  getDesktops: () => Promise<Array<{ id: string; name: string }>>
  createDesktop: (desktopId: string, name: string) => Promise<{ id: string; name: string }>
  deleteDesktop: (desktopId: string) => Promise<boolean>
  openApp: (node: DesktopNode) => Promise<boolean>
  getInstalledApps: () => Promise<Array<{ name: string; path: string; icon?: string }>>
  fetchFavicon: (url: string) => Promise<{ success: boolean; icon: string }>
}

global {
  interface Window {
    __TAURI_OS_PLUGIN_INTERNALS__: Record<string, unknown>
    __TAURI_INTERNALS__: Record<string, unknown>
    isTauri: boolean
    __TAURI_EVENT_PLUGIN_INTERNALS__: Record<string, unknown>
    desktopAPI: DesktopAPI
  }
}

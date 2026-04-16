import { DesktopNode } from '@common/types/DesktopNode'
import { PluginEntityWrap, PluginVerifyResult } from '@common/types/PluginEntity'

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

interface PluginAPI {
  list: () => Promise<Array<PluginEntityWrap>>
  verify(path: string): Promise<PluginVerifyResult>
  install(path: string): Promise<void>
  upgrade(identifier: string, path: string): Promise<void>
  uninstall(identifier: string): Promise<void>
}

interface FileFilter {
  extensions: string[]
  name: string
}

interface OpenDialogSyncOptions {
  title?: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
  properties?: Array<
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
    | 'promptToCreate'
    | 'noResolveAliases'
    | 'treatPackageAsDirectory'
    | 'dontAddToRecent'
  >
  message?: string
  securityScopedBookmarks?: boolean
}

interface supportAPI {
  shellOpenDialog(options: OpenDialogSyncOptions): Promise<Array<string> | undefined>
  isWindows: () => boolean
}

global {
  interface Window {
    __TAURI_OS_PLUGIN_INTERNALS__: Record<string, unknown>
    __TAURI_INTERNALS__: Record<string, unknown>
    isTauri: boolean
    __TAURI_EVENT_PLUGIN_INTERNALS__: Record<string, unknown>
    desktopAPI: DesktopAPI
    pluginAPI: PluginAPI
    supportAPI: supportAPI
  }
}

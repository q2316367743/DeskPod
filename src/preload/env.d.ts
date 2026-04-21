import { AiModelSetting, DesktopNode, QuickApp, QuickAppCore, Setting } from '@common/types'
import { PluginEntityWrap, PluginVerifyResult, ViewOptions } from '@common/types'

interface DesktopAPI {
  onChange: (callback: () => void) => void
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
  widgetCreate: (pluginId: string, label: string, options: ViewOptions) => Promise<void>
  widgetMove: (pluginId: string, label: string, options: ViewOptions) => Promise<void>
  widgetDelete: (pluginId: string, label: string) => Promise<void>

  contextmenuCreateDesktop: (
    desktopId: string,
    x: number,
    y: number,
    column: number,
    row: number
  ) => Promise<void>
  contextmenuCreateNode: (nodeId: string, x: number, y: number) => Promise<void>
}

interface PluginAPI {
  list: () => Promise<Array<PluginEntityWrap>>
  verify(path: string): Promise<PluginVerifyResult>
  install(path: string): Promise<void>
  upgrade(identifier: string, path: string): Promise<void>
  uninstall(identifier: string): Promise<void>
  preload(): string
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

interface SupportAPI {
  shellOpenDialog(options: OpenDialogSyncOptions): Promise<Array<string> | undefined>
  isWindows: () => boolean
  join: (...path: Array<string>) => string
  basename: (path: string) => string
  extname: (path: string) => string
  dirname: (path: string) => string
  sep: '\\' | '/'
}

interface QuickAPI {
  list: () => Promise<Array<QuickApp>>
  install: (form: QuickAppCore) => Promise<void>
  upgrade: (id: string, form: QuickAppCore) => Promise<void>
  uninstall: (id: string) => Promise<void>
}

interface SettingAPI {
  onChange: (callback: () => void) => void
  all: () => Promise<Setting>
  set: <K extends keyof Setting>(key: K, value: Setting[K]) => Promise<void>
  listAiModel: () => Promise<Array<AiModelSetting>>
  addAiModel: (model: AiModelSetting) => Promise<void>
  deleteAiModel: (id: string) => Promise<void>
  listBgImage: (theme: 'light' | 'dark') => Promise<Array<string>>
  uploadBgImage: (theme: 'light' | 'dark', path: string) => Promise<void>
  deleteBgImage: (path: string) => Promise<void>
}

interface LogAPI {
  info: (...params: Array<unknown>) => void
  warn: (...params: Array<unknown>) => void
  error: (...params: Array<unknown>) => void
  debug: (...params: Array<unknown>) => void
}

global {
  interface Window {
    // tauri 需要的定义
    __TAURI_OS_PLUGIN_INTERNALS__: Record<string, unknown>
    __TAURI_INTERNALS__: Record<string, unknown>
    isTauri: boolean
    __TAURI_EVENT_PLUGIN_INTERNALS__: Record<string, unknown>
    // 内置窗口需要的定义
    desktopAPI: DesktopAPI
    pluginAPI: PluginAPI
    supportAPI: SupportAPI
    quickAPI: QuickAPI
    settingAPI: SettingAPI
    logAPI: LogAPI
  }
}

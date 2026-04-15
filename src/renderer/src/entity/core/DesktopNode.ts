// 统一的节点接口定义 (TypeScript 描述，便于理解结构)
interface DesktopNode {
  id: string // 唯一标识 (uuid)
  type: 'folder' | 'app' | 'link' | 'builtin' | 'widget'
  name: string // 显示名称
  icon: string // 图标路径或内置图标标识符

  // --- 层级关系 ---
  parentId: string | null // null 表示在根目录，否则指向某个 folder 的 id
  sortIndex: number // 在同一层级下的排序权重

  // --- 多桌面支持 ---
  desktopId: string // 属于哪个桌面 (默认为 'desktop-1')

  // --- 按需字段 (根据 type 不同而存在) ---
  meta?: {
    // type === 'app' 时
    executablePath?: string // 本地软件路径 (如 'C:\...\chrome.exe')
    args?: string[] // 启动参数

    // type === 'link' 时
    url?: string // 网站地址

    // type === 'builtin' 或 'plugin' 时
    pluginId?: string // 插件的唯一ID (如 'sys-settings')
    entry?: string // 插件入口文件 (如 'index.html')
    permissions?: string[] // 插件权限 (仅 plugin 有)

    // type === 'widget' 时
    widgetId?: string // 小部件插件ID
    width?: number // 小部件宽 (网格单位，如占 2 格)
    height?: number // 小部件高 (网格单位，如占 1 格)
  }
}

export type DesktopNodeType =
  | 'folder' // 文件夹
  | 'link' // 网站链接
  | 'plugin' // 插件
  | 'widget' // 小组件
  | 'builtin' // 内置窗口
  | 'quick' // 快应用，就是只有一个 html 文件的纯 web 应用
  // --- 本地 ---
  | 'app' // APP
  | 'file' // 本地文件
  | 'directory' // 本地目录
  | 'command' // 命令
  | 'script' // 脚本

export interface DesktopNodeMeta {
  root?: string // 各类类型的根目录

  // type === 'app' 时
  args?: string[] // 启动参数

  // type === 'link' 时
  url?: string // 网站地址

  // type === 'command' 时
  command?: string // 命令

  /**
   * 打开方式，默认浏览器还是内置浏览器
   * - 当是 link 时：'default' | 'inner'
   * - 当 type === 'script' 时，此处代表了执行的程序
   */
  openWith?: string

  // type === 'plugin' 或 type ===  'widget' && source === 'extension' 或 type === 'quick' 时
  pluginId?: string // 插件的唯一ID (如 'sys-settings')
  label?: string // 插件的 label

  /**
   * 来源
   * - 当 type === 'widget' 时，source 可能的值：'builtin' | 'quick' | 'plugin'
   * - 当 type === 'script' 时，source 代表了脚本的类型
   */
  source?: string

  // 当 source === 'builtin' 时使用
  builtinId?: string // 内部标识符，如 'sys-clock', 'sys-cpu'

  widgetId?: string // 小部件插件ID

  // 如果打开窗口，通用属性
  width?: number // 小部件宽 (网格单位，如占 2 格)
  height?: number // 小部件高 (网格单位，如占 1 格)
  minWidth?: number
  minHeight?: number
  // 标题栏样式
  titleBarStyle?: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover'
}

// 统一的节点接口定义 (TypeScript 描述，便于理解结构)
export interface DesktopNode {
  id: string // 唯一标识 (uuid)
  type: DesktopNodeType
  name: string // 显示名称
  icon: string // 图标路径或内置图标标识符

  // --- 层级关系 ---
  parentId: string | null // null 表示在根目录，否则指向某个 folder 的 id
  sortIndex: number // 在同一层级下的排序权重

  // --- 多桌面支持 ---
  desktopId: string // 属于哪个桌面 (默认为 'default')

  x: number // 距离桌面左边缘的距离
  y: number // 距离桌面顶部的距离
  row: number // 占几行
  column: number // 占几列
  resizeable?: boolean // 是否支持调整大小，默认不支持
  minRow?: number // 最小占几行，默认 2
  minCol?: number // 最小占几列，默认 2

  // --- 按需字段 (根据 type 不同而存在) ---
  meta: DesktopNodeMeta
}

export interface DesktopWorkspace {
  id: string
  name: string
  icon: string
}

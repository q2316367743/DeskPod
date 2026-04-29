export type PluginEntityCapability =
  | string
  | {
      identifier: string
      allow?: Array<string>
      deny?: Array<string>
    }

export interface PluginEntity {
  identifier: string
  productName: string
  version: string
  description: string
  // 图片，是个相对目录，相对插件根目录
  icon: string
  // 开发者
  author?: string
  // 官网
  homepage?: string

  // 开发者模式
  develop?: {
    // 主窗口开发者模式下的路径
    main: string
    // 小部件开发者模式下的路径, label => url
    widgets: Record<string, string>
  }

  // 后台 js，自启动会自动维护，否则会第一次启动时加载
  background?: string
  // 运行的平台
  platform: Array<'win32' | 'darwin' | 'linux'>

  // 启动窗口，只能一个
  main?: {
    label: string
    title: string
    path: string
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
  }
  /**
   * 小部件
   */
  widgets?: Array<{
    label: string
    title: string
    path: string
    // 预览图片
    preview: string
    // 支持的布局
    layouts: Array<{
      rows: number
      cols: number
      minRows: number
      minCols: number
    }>
    // 可能存在的菜单，会触发 DeskPodEvent.WIDGET_MENU_CLICK 事件
    menu?: Array<{
      label: string
      value: string
    }>
  }>
  // 权限
  capabilities: Array<PluginEntityCapability>

  /**
   * 资源目录，基于根目录的相对目录，安装时会将此目录的文件拷贝到资源目录中
   */
  resources: Array<string> | Record<string, string>
}

export interface PluginEntityWrap extends PluginEntity {
  // 运行时目录
  root: string
}

export interface PluginVerifyResult {
  // 插件配置
  config: PluginEntity
  // 插件是否存在
  exists: boolean
}

import { DesktopNode } from '@common/types/DesktopNode'

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
  // 插件根路径
  root: string
}

export interface PluginVerifyResult {
  // 插件配置
  config: PluginEntity
  // 插件是否存在
  exists: boolean
}

export function pluginEntityToDesktopNode(
  plugin: PluginEntityWrap,
  desktopId: string
): DesktopNode {
  return {
    id: '',
    type: 'plugin',
    name: plugin.productName,
    icon: `file://${plugin.root}/runtime/${plugin.icon}`,
    parentId: null,
    sortIndex: 0,
    desktopId: desktopId,
    row: 0,
    column: 0,
    meta: {
      pluginId: plugin.identifier,
      root: plugin.root
    }
  }
}

export function pluginEntityToWidgetNode(
  plugin: PluginEntityWrap,
  desktopId: string
): Array<DesktopNode> {
  if (!plugin.widgets) return []
  return plugin.widgets.flatMap((widget) => {
    return widget.layouts.map((layout) => {
      return {
        id: '',
        type: 'widget',
        name: widget.title,
        icon: `file://${plugin.root}/runtime/${widget.preview}`,
        parentId: null,
        sortIndex: 0,
        desktopId: desktopId,
        row: 0,
        column: 0,
        meta: {
          pluginId: plugin.identifier,
          root: `file://${plugin.root}/runtime/${widget.path}`,
          label: widget.label,
          source: 'plugin',
          height: layout.rows,
          width: layout.cols
        }
      } as DesktopNode
    })
  })
}

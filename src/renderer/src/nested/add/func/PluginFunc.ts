import { DesktopNode, PluginEntityWrap } from '@common/types'

export function pluginEntityToDesktopNode(
  plugin: PluginEntityWrap,
  desktopId: string
): DesktopNode {
  return {
    id: '',
    type: 'plugin',
    name: plugin.productName,
    icon: window.supportAPI.url.pathToHref(
      window.supportAPI.path.join(plugin.root, 'runtime', plugin.icon)
    ),
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
        icon: window.supportAPI.url.pathToHref(
          window.supportAPI.path.join(plugin.root, 'runtime', widget.preview)
        ),
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

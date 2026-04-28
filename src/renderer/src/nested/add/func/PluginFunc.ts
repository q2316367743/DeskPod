import { DesktopNode, PluginEntityWrap } from '@common/types'

export function pluginEntityToDesktopNode(
  plugin: PluginEntityWrap,
  desktopId: string
): DesktopNode {
  return {
    id: '',
    type: 'plugin',
    name: plugin.productName,
    icon: window.supportAPI.url.pathToHref(window.supportAPI.path.join(plugin.root, plugin.icon)),
    parentId: null,
    sortIndex: 0,
    desktopId: desktopId,
    x: 0,
    y: 0,
    row: 1,
    column: 1,
    meta: {
      pluginId: plugin.identifier,
      root: plugin.root,
      width: plugin.main?.width,
      height: plugin.main?.height,
      minWidth: plugin.main?.minWidth,
      minHeight: plugin.main?.minHeight
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
          window.supportAPI.path.join(plugin.root, widget.preview)
        ),
        parentId: null,
        sortIndex: 0,
        desktopId: desktopId,
        x: 0,
        y: 0,
        row: layout.rows,
        column: layout.cols,
        meta: {
          pluginId: plugin.identifier,
          root: window.supportAPI.url.pathToHref(
            window.supportAPI.path.join(plugin.root, widget.path)
          ),
          label: widget.label,
          source: 'plugin'
        }
      } as DesktopNode
    })
  })
}

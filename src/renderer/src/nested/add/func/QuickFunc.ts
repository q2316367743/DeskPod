import { DesktopNode, QuickApp } from '@common/types'

export function quickAppToDesktopNode(app: QuickApp, desktopId: string): DesktopNode {
  return {
    id: '',
    type: 'quick',
    name: app.name,
    icon: app.icon
      ? window.supportAPI.url.pathToHref(window.supportAPI.path.join(app.root, app.id))
      : '',
    parentId: null,
    sortIndex: 0,
    desktopId: desktopId,
    x: 0,
    y: 0,
    row: 1,
    column: 1,
    meta: {
      pluginId: app.id,
      root: app.root,
      width: app.width,
      height: app.height
    }
  }
}

export function quickAppToWidgetNode(app: QuickApp, desktopId: string): DesktopNode {
  return {
    id: '',
    type: 'widget',
    name: app.name,
    icon: app.icon
      ? window.supportAPI.url.pathToHref(window.supportAPI.path.join(app.root, app.id))
      : '',
    parentId: null,
    sortIndex: 0,
    desktopId: desktopId,
    x: 0,
    y: 0,
    row: app.height,
    column: app.width,
    resizeable: true,
    minCol: app.min_width,
    minRow: app.min_height,
    meta: {
      pluginId: app.id,
      root: `file://${app.root}/${app.entry}`,
      source: 'quick'
    }
  }
}

import { DesktopNode } from '@common/types'
import { shell } from 'electron'
import { createPluginWindow } from '$/module/plugin'
import { pluginManager } from '$/global/BeanFactory'
import { createQuickWindow } from '$/module/quick'
import { logError } from '$/lib/log'
import { openBuiltinApp, openLinkApp } from '$/module/desktop'
import { openCommandApp, openScriptApp } from '$/module/native'

const openFileApp = async (node: DesktopNode): Promise<boolean> => {
  const root = node.meta?.root
  if (!root) return false
  await shell.openPath(root)
  return true
}
const openDirectoryApp = async (node: DesktopNode): Promise<boolean> => {
  const root = node.meta?.root
  if (!root) return false
  await shell.openPath(root)
  return true
}
const openNativeApp = async (node: DesktopNode): Promise<boolean> => {
  const root = node.meta?.root
  if (!root) return false
  await shell.openPath(root)
  return true
}

export async function openApp(node: DesktopNode, query?: Record<string, string>): Promise<boolean> {
  switch (node.type) {
    case 'app':
      return openNativeApp(node)
    case 'link':
      return openLinkApp(node)
    case 'builtin':
      return openBuiltinApp(node, query)
    case 'quick':
      return createQuickWindow(node)
    case 'directory':
      return openDirectoryApp(node)
    case 'file':
      return openFileApp(node)
    case 'plugin': {
      const pluginId = node.meta!.pluginId!
      // 启动插件
      const entity = pluginManager.getById(pluginId)
      if (!entity) return false
      await createPluginWindow(
        {
          label: entity.main!.label,
          url: entity.main!.path,
          icon: entity.icon,
          width: node.meta?.width,
          height: node.meta?.height,
          minHeight: node.meta?.minHeight,
          minWidth: node.meta?.minWidth
        },
        pluginId
      )
      return true
    }
    case 'widget':
      logError('小部件不支持打开')
      return false
    case 'command':
      return openCommandApp(node)
    case 'script':
      return openScriptApp(node)
    default:
      logError('Unknown node type: ' + node.type)
      return false
  }
}

import { DesktopNode } from '@common/types'
import { shell, BrowserWindow } from 'electron'
import { createPluginWindow } from '$/module/plugin'
import { pluginManager } from '$/global/BeanFactory'
import { createQuickWindow } from '$/module/quick'
import { logError } from '$/lib/log'
import { openBuiltinApp } from '$/module/desktop'
import { PARTITION } from '@common/global'

const openLinkApp = async (node: DesktopNode): Promise<boolean> => {
  const url = node.meta?.url
  if (!url) return false
  if (node.meta?.openWith === 'inner') {
    const bw = new BrowserWindow({
      title: node.name,
      width: node.meta?.width,
      height: node.meta?.height,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: false,
        partition: PARTITION.LINK
      }
    })
    await bw.loadURL(url)
    return true
  }
  await shell.openExternal(url)
  return true
}

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
    default:
      logError('Unknown node type: ' + node.type)
      return false
  }
}

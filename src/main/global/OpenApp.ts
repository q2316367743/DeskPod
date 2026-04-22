import { DesktopNode } from '@common/types'
import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'
import { createPluginWindow } from '$/module/plugin'
import { pluginManager } from '$/global/BeanFactory'
import { createQuickWindow } from '$/module/quick'
import { PARTITION } from '@common/global'
import { logError } from '$/lib/log'

const builtinWindowMap = new Map<string, BrowserWindow>()

const openBuiltinApp = async (
  node: DesktopNode,
  query?: Record<string, string>
): Promise<boolean> => {
  const builtinId = node.meta?.builtinId || ''
  const builtinWindow = builtinWindowMap.get(builtinId)
  if (builtinWindow) {
    builtinWindow.show()
    builtinWindow.focus()
    return true
  }

  const bw = new BrowserWindow({
    title: node.name,
    width: node.meta?.width || 800,
    height: node.meta?.height || 600,
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      partition: PARTITION.BUILTIN
    }
  })
  bw.on('close', () => {
    builtinWindowMap.delete(builtinId)
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    let q = ''
    if (query) {
      q =
        '?' +
        Object.keys(query)
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
          .join('&')
    }
    await bw.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${builtinId}.html${q}`)
  } else {
    await bw.loadFile(join(__dirname, `../renderer/${builtinId}.html`), {
      query: query
    })
  }
  builtinWindowMap.set(builtinId, bw)
  return true
}

const openLinkApp = async (node: DesktopNode): Promise<boolean> => {
  const url = node.meta?.url
  if (!url) return false
  if (node.meta?.openWith === 'inner') {
    const bw = new BrowserWindow({
      title: node.name,
      width: node.meta?.width,
      height: node.meta?.height
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
  shell.showItemInFolder(root)
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
          width: entity.main?.width,
          height: entity.main?.height,
          minHeight: entity.main?.minHeight,
          minWidth: entity.main?.minWidth
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

import { DesktopNode } from '@common/types'
import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'
import { createPluginWindow } from '$/module/plugin'
import { pluginManager } from '$/global/BeanFactory'
import { createQuickWindow } from '$/module/quick'

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
      webSecurity: false
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

export async function openApp(node: DesktopNode, query?: Record<string, string>): Promise<boolean> {
  if (node.type === 'app' && node.meta?.executablePath) {
    await shell.openPath(node.meta.executablePath)
    return true
  }
  if (node.type === 'link' && node.meta?.url) {
    if (node.meta?.openWith === 'inner') {
      const bw = new BrowserWindow({
        title: node.name,
        width: node.meta?.width,
        height: node.meta?.height
      })
      await bw.loadURL(node.meta.url)
      return true
    }
    await shell.openExternal(node.meta.url)
    return true
  }
  if (node.type === 'builtin') {
    return openBuiltinApp(node, query)
  }
  if (node.type === 'plugin') {
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
  if (node.type === 'quick') {
    return createQuickWindow(node)
  }
  return false
}

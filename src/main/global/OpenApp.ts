import { DesktopNode } from '@common/types'
import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'
import { createPluginWindow } from '$/module/plugin'
import { pluginManager, quickManager } from '$/global/BeanFactory'

export async function openApp(node: DesktopNode): Promise<boolean> {
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
    const builtinWindow = new BrowserWindow({
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
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      await builtinWindow.loadURL(
        `${process.env['ELECTRON_RENDERER_URL']}/${node.meta?.builtinId}.html`
      )
    } else {
      await builtinWindow.loadFile(join(__dirname, `../renderer/${node.meta?.builtinId}.html`))
    }
    return true
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
    const quickId = node.meta!.pluginId!
    const entity = quickManager.getById(quickId)
    if (!entity) return false
    const bw = new BrowserWindow({
      title: node.name,
      icon: entity.icon ? join(entity.root, entity.icon) : undefined,
      width: node.meta?.width,
      height: node.meta?.height,
      webPreferences: {
        sandbox: true,
        webSecurity: false,
        nodeIntegration: false
      }
    })
    await bw.loadFile(join(entity.root, entity.entry))
    return true
  }
  return false
}

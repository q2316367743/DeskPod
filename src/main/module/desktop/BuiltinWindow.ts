import { DesktopNode } from '@common/types'
import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'
import { PARTITION } from '@common/global'

const builtinWindowMap = new Map<string, BrowserWindow>()

export const openBuiltinApp = async (
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
    minWidth: node.meta?.minWidth || 800,
    minHeight: node.meta?.minHeight || 600,
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

export const closeBuiltinWindow = async (builtinKey: string): Promise<boolean> => {
  const builtinWindow = builtinWindowMap.get(builtinKey)
  if (builtinWindow) {
    try {
      if (!builtinWindow.isDestroyed()) {
        builtinWindow.close()
      }
      return true
    } finally {
      builtinWindowMap.delete(builtinKey)
    }
  }
  return false
}

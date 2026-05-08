import { DesktopNode } from '@common/types'
import ews from 'electron-window-state'
import { APP_DATA_DB_STATE_LINK_PATH } from '$/global/Constant'
import { BrowserWindow, shell } from 'electron'
import { PARTITION } from '@common/global'
import { taskbarManager } from '$/global/BeanFactory'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { logError } from '$/lib/log'

const createBrowserWindow = async (node: DesktopNode, url: string) => {
  const bwEws = ews({
    defaultHeight: node.meta?.height,
    defaultWidth: node.meta?.width,
    path: APP_DATA_DB_STATE_LINK_PATH,
    file: `${node.id}.json`
  })
  // TODO: 此处可以 BaseWindow + WebContentView
  const bw = new BrowserWindow({
    title: node.name,
    x: bwEws.x,
    y: bwEws.y,
    width: bwEws.width,
    height: bwEws.height,
    fullscreen: bwEws.isFullScreen,
    skipTaskbar: false,
    alwaysOnTop: false,
    minWidth: node.meta?.minWidth,
    minHeight: node.meta?.minHeight,
    titleBarStyle: node.meta?.titleBarStyle,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      partition: PARTITION.LINK
    }
  })
  bwEws.manage(bw)
  await bw.loadURL(url)
  return bw
}

export const openLinkApp = async (node: DesktopNode): Promise<boolean> => {
  const url = node.meta?.url
  if (!url) return false
  if (node.meta.openWith === 'inner') {
    if (node.meta.multi) {
      const bw = await createBrowserWindow(node, url)
      taskbarManager.manage({ bw, type: 'link', icon: node.icon, name: node.name })
    } else {
      // 不支持多开
      if (taskbarManager.show(node.id)) {
        // 未打开
        return true
      }
      const bw = await createBrowserWindow(node, url)
      taskbarManager.manage({ bw, type: 'link', icon: node.icon, name: node.name }, node.id)
      return true
    }

    return true
  }
  await shell.openExternal(url)
  return true
}

export const deleteLinkApp = (node: DesktopNode) => {
  rm(join(APP_DATA_DB_STATE_LINK_PATH, `${node.id}.json`)).catch((e) => {
    logError('删除链接状态字段失败', e)
  })
}

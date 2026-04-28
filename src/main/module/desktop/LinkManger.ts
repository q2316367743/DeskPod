import { DesktopNode } from '@common/types'
import ews from 'electron-window-state'
import { APP_DATA_DB_STATE_LINK_PATH } from '$/global/Constant'
import { BrowserWindow, shell } from 'electron'
import { PARTITION } from '@common/global'
import { taskbarManager } from '$/global/BeanFactory'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { logError } from '$/lib/log'

export const openLinkApp = async (node: DesktopNode): Promise<boolean> => {
  const url = node.meta?.url
  if (!url) return false
  if (node.meta?.openWith === 'inner') {
    const bwEws = ews({
      defaultHeight: node.meta?.height,
      defaultWidth: node.meta?.width,
      path: APP_DATA_DB_STATE_LINK_PATH,
      file: `${node.id}.json`
    })
    const bw = new BrowserWindow({
      title: node.name,
      x: bwEws.x,
      y: bwEws.y,
      width: bwEws.width,
      height: bwEws.height,
      fullscreen: bwEws.isFullScreen,
      skipTaskbar: true,
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
    taskbarManager.manage({ bw, type: 'link', icon: node.icon, name: node.name })
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

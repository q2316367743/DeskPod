import { BrowserWindow } from 'electron'
import ews from 'electron-window-state'
import { join } from 'node:path'
import { DesktopNode } from '@common/types'
import { quickManager, taskbarManager } from '$/global/BeanFactory'
import { logError } from '$/lib/log'
import { PARTITION } from '@common/global'
import { APP_DATA_DB_STATE_QUICK_PATH } from '$/global/Constant'

const quickMap = new Map<string, Map<number, BrowserWindow>>()

export async function createQuickWindow(node: DesktopNode): Promise<boolean> {
  const quickId = node.meta!.pluginId!
  const entity = quickManager.getById(quickId)
  if (!entity) return false
  const bwEws = ews({
    defaultHeight: node.meta?.height,
    defaultWidth: node.meta?.width,
    path: APP_DATA_DB_STATE_QUICK_PATH,
    file: `${quickId}.json`
  })
  const bw = new BrowserWindow({
    title: node.name,
    icon: entity.icon ? join(entity.root, entity.icon) : undefined,
    x: bwEws.x,
    y: bwEws.y,
    width: bwEws.width,
    height: bwEws.height,
    fullscreen: bwEws.isFullScreen,
    minWidth: node.meta?.minWidth,
    minHeight: node.meta?.minHeight,
    skipTaskbar: false,
    webPreferences: {
      sandbox: true,
      webSecurity: false,
      nodeIntegration: false,
      partition: PARTITION.QUICK(quickId)
    }
  })
  bwEws.manage(bw)
  taskbarManager.manage({ bw, type: 'quick', icon: node.icon, name: node.name })
  await bw.loadFile(join(entity.root, entity.entry))
  const map = quickMap.get(quickId)
  if (map) {
    map.set(bw.webContents.id, bw)
  } else {
    quickMap.set(quickId, new Map([[bw.webContents.id, bw]]))
  }
  bw.on('close', () => {
    quickMap.get(quickId)?.delete(bw.webContents.id)
  })
  return true
}

export function closeQuickWindow(quickId: string) {
  const map = quickMap.get(quickId)
  if (map) {
    for (const bw of map.values()) {
      try {
        // 批量关闭
        bw.close()
      } catch (e) {
        logError(`快应用 「${quickId}」 关闭时出错`, e)
      }
    }
  }
  quickMap.delete(quickId)
}

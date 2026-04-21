import { dialog, Menu, Notification } from 'electron'
import { desktopManager, getMainWindow } from '$/global/BeanFactory'
import { openApp } from '$/global/OpenApp'
import { DesktopNodeType } from '@common/types'

function openAppWrap(
  name: string,
  type: DesktopNodeType,
  desktopId: string,
  column: number,
  row: number
) {
  return openApp(
    {
      type: 'builtin',
      id: '0',
      desktopId: '',
      row: -1,
      column: -1,
      name: name,
      icon: '',
      sortIndex: 0,
      parentId: null,
      meta: {
        builtinId: 'add',
        width: 800,
        height: 600
      }
    },
    {
      type: type,
      desktopId: desktopId,
      column: `${column}`,
      row: `${row}`
    }
  )
}

export function createContextMenuByDesktop(
  desktopId: string,
  x: number,
  y: number,
  column: number,
  row: number
) {
  Menu.buildFromTemplate([
    {
      label: '添加应用',
      click: () => openAppWrap('添加应用', 'app', desktopId, column, row)
    },
    {
      label: '添加链接',
      click: () => openAppWrap('添加链接', 'link', desktopId, column, row)
    },
    {
      label: '添加插件',
      click: () => openAppWrap('添加插件', 'plugin', desktopId, column, row)
    },
    {
      label: '添加快应用',
      click: () => openAppWrap('添加快应用', 'quick', desktopId, column, row)
    },
    {
      label: '添加小部件',
      click: () => openAppWrap('添加小部件', 'widget', desktopId, column, row)
    }
  ]).popup({
    window: getMainWindow(),
    x: x,
    y: y
  })
}
export function createContextMenuByNode(nodeId: string, x: number, y: number) {
  Menu.buildFromTemplate([
    {
      label: '卸载',
      click: async () => {
        const r = dialog.showMessageBoxSync({
          type: 'question',
          message: '是否确认卸载？',
          title: '卸载',
          buttons: ['取消', '确定']
        })
        if (r === 1) {
          // 卸载
          try {
            await desktopManager.deleteNode(nodeId)
            new Notification({
              title: '卸载成功',
              body: '卸载成功'
            }).show()
          } catch (e) {
            new Notification({
              title: '卸载失败',
              body: `原因：${(e as Error)?.message}`
            }).show()
          }
        }
      }
    }
  ]).popup({
    window: getMainWindow(),
    x: x,
    y: y
  })
}

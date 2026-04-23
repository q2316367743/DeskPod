import { dialog, Menu, Notification } from 'electron'
import { basename } from 'node:path'
import { BUILTIN_KEY } from '@common/global'
import { desktopManager } from '$/global/BeanFactory'
import { openApp } from '$/global/OpenApp'
import { getMainWindow } from '$/module/desktop'
import { useSnowflake } from '@common/utils'

function openAppWrap(name: string, type: string, desktopId: string, column: number, row: number) {
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
        builtinId: BUILTIN_KEY.ADD,
        width: 832,
        height: 616,
        minWidth: 832,
        minHeight: 616
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

function openFolderWidget(desktopId: string, column: number, row: number) {
  const path = dialog.showOpenDialogSync({
    title: '选择文件夹',
    buttonLabel: '添加',
    properties: ['openDirectory', 'createDirectory']
  })
  if (!path || !path[0]) return
  const target = path[0]
  const name = basename(target)
  desktopManager.updateNode({
    id: useSnowflake().nextId(),
    type: 'widget',
    name: name,
    icon: '',
    parentId: null,
    sortIndex: 0,
    desktopId: desktopId,
    row: row,
    column: column,
    meta: {
      root: target,
      source: 'builtin',
      builtinId: 'folder',
      width: 4,
      height: 6
    }
  })
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
      click: () => openAppWrap('添加应用', '/link', desktopId, column, row)
    },
    {
      label: '添加文件',
      click: () => openAppWrap('添加文件', '/native/file', desktopId, column, row)
    },
    {
      label: '添加文件夹',
      click: () => openAppWrap('添加文件夹', '/native/folder', desktopId, column, row)
    },
    {
      label: '添加分区',
      submenu: [
        {
          label: '空分区',
          click: () => {
            desktopManager.updateNode({
              id: useSnowflake().nextId(),
              type: 'folder',
              name: '空分区',
              icon: 'icon:directory',
              parentId: null,
              sortIndex: 0,
              desktopId: desktopId,
              row: row,
              column: column,
              meta: {
                width: 4,
                height: 6
              }
            })
          }
        },
        {
          label: '文件夹分区',
          click: () => openFolderWidget(desktopId, column, row)
        }
      ]
    }
  ]).popup({
    window: getMainWindow(),
    x: x,
    y: y
  })
}

export function createContextMenuByNode(nodeId: string, x: number, y: number) {
  const menus: Parameters<typeof Menu.buildFromTemplate>[0] = []
  const node = desktopManager.getNode(nodeId)
  if (!node) return
  if (node.type !== 'widget' && node.type !== 'folder') {
    menus.push({
      label: '打开',
      click: () => {
        openApp(node)
      }
    })
  }

  menus.push({
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
  })

  Menu.buildFromTemplate(menus).popup({
    window: getMainWindow(),
    x: x,
    y: y
  })
}

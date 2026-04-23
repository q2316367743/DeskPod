import { dialog, Menu, Notification } from 'electron'
import { basename } from 'node:path'
import { BUILTIN_KEY } from '@common/global'
import { desktopManager } from '$/global/BeanFactory'
import { openApp } from '$/global/OpenApp'
import { getMainWindow } from '$/module/desktop'
import { useSnowflake } from '@common/utils'
import { DesktopCreateParam } from '@common/params'

function openAppWrap(name: string, type: string, param: DesktopCreateParam) {
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
      parentId: param.parentId,
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
      desktopId: param.desktopId,
      parentId: param.parentId || '',
      column: `${param.column}`,
      row: `${param.row}`
    }
  )
}

function openFolderWidget(param: DesktopCreateParam) {
  const path = dialog.showOpenDialogSync({
    title: '选择文件夹',
    buttonLabel: '添加',
    properties: ['openDirectory', 'createDirectory']
  })
  if (!path || !path[0]) return
  const target = path[0]
  const name = basename(target)
  return desktopManager.updateNode({
    id: useSnowflake().nextId(),
    type: 'widget',
    name: name,
    icon: '',
    parentId: param.parentId,
    sortIndex: 0,
    desktopId: param.desktopId,
    row: param.row,
    column: param.column,
    meta: {
      root: target,
      source: 'builtin',
      builtinId: 'folder',
      width: 4,
      height: 6
    }
  })
}

export function createContextMenuByDesktop(param: DesktopCreateParam) {
  Menu.buildFromTemplate([
    {
      label: '添加应用',
      click: () => openAppWrap('添加应用', '/link', param)
    },
    {
      label: '添加文件',
      click: () => openAppWrap('添加文件', '/native/file', param)
    },
    {
      label: '添加文件夹',
      click: () => openAppWrap('添加文件夹', '/native/folder', param)
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
              desktopId: param.desktopId,
              row: param.row,
              column: param.column,
              meta: {
                width: 4,
                height: 6
              }
            })
          }
        },
        {
          label: '文件夹分区',
          click: () => openFolderWidget(param)
        }
      ]
    }
  ]).popup({
    window: getMainWindow(),
    x: param.x,
    y: param.y
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

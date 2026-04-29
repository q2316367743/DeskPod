import { dialog, Menu, Notification } from 'electron'
import { basename } from 'node:path'
import { BUILTIN_KEY } from '@common/global'
import { desktopManager } from '$/global/BeanFactory'
import { openApp } from '$/global/OpenApp'
import { getMainWindow } from '$/module/desktop'
import { useSnowflake } from '@common/utils'
import { DesktopCreateParam } from '@common/params'

function openAppWrap(name: string, type: string, param: Partial<DesktopCreateParam>) {
  return openApp(
    {
      type: 'builtin',
      id: '0',
      desktopId: '',
      x: -1,
      y: -1,
      row: -1,
      column: -1,
      name: name,
      icon: '',
      sortIndex: 0,
      parentId: param.parentId || null,
      meta: {
        builtinId: BUILTIN_KEY.ADD,
        width: 850,
        height: 620,
        minWidth: 850,
        minHeight: 620
      }
    },
    {
      type: type,
      desktopId: param.desktopId || '',
      parentId: param.parentId || '',
      x: `${param.nodeX || ''}`,
      y: `${param.nodeY || ''}`,
      // 为了更新
      update: param.update ? '1' : '0',
      nodeId: param.nodeId || ''
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
    y: param.nodeY,
    x: param.nodeX,
    row: 4,
    column: 5,
    resizeable: true,
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
  const menus: Parameters<typeof Menu.buildFromTemplate>[0] = []
  menus.push(
    {
      label: '添加链接',
      click: () => openAppWrap('添加链接', '/link', param)
    },
    {
      label: '添加应用',
      click: () => openAppWrap('添加应用', '/native/app', param)
    },
    {
      label: '添加本地功能',
      submenu: [
        {
          label: '添加文件',
          click: () => openAppWrap('添加文件', '/native/file', param)
        },
        {
          label: '添加文件夹',
          click: () => openAppWrap('添加文件夹', '/native/folder', param)
        },
        {
          label: '添加命令',
          click: () => openAppWrap('添加命令', '/native/command', param)
        },
        {
          label: '添加脚本',
          click: () => openAppWrap('添加脚本', '/native/script', param)
        }
      ]
    }
  )
  if (!param.parentId && param.desktopId !== 'dock') {
    menus.push({
      label: '添加分区',
      submenu: [
        {
          label: '空分区',
          click: () => {
            return desktopManager.updateNode({
              id: useSnowflake().nextId(),
              type: 'folder',
              name: '空分区',
              icon: 'icon:directory',
              parentId: null,
              sortIndex: 0,
              desktopId: param.desktopId,
              y: param.nodeY,
              x: param.nodeX,
              column: 4,
              row: 5,
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
    })
  }
  Menu.buildFromTemplate(menus).popup({
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
  if (node.type === 'link' || node.type === 'command' || node.type === 'script') {
    // 这三个可以编辑
    menus.push({
      label: '编辑',
      click: () => {
        let type = '/link'
        if (node.type === 'command') type = '/native/command'
        else if (node.type === 'script') type = '/native/script'
        openAppWrap('编辑应用', type, { update: true, nodeId: node.id })
      }
    })
  }

  menus.push({
    label: '删除',
    click: async () => {
      const r = dialog.showMessageBoxSync({
        type: 'question',
        message: '是否确认删除？',
        title: '删除',
        buttons: ['取消', '确定']
      })
      if (r === 1) {
        // 删除
        try {
          await desktopManager.deleteNode(nodeId)
          new Notification({
            title: '删除成功',
            body: '删除成功'
          }).show()
        } catch (e) {
          new Notification({
            title: '删除失败',
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

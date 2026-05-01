import { dialog, ipcMain } from 'electron'
import { pluginManager } from '$/global/BeanFactory'
import { openApp } from '$/global/OpenApp'
import { BUILTIN_KEY } from '@common/global'

ipcMain.handle('/main/plugin/list', () => {
  return pluginManager.list()
})

ipcMain.handle('/main/plugin/verify', (_e, path) => {
  return pluginManager.verify(path)
})

ipcMain.handle('/main/plugin/install', (_e, path) => {
  return pluginManager.install(path)
})

ipcMain.handle('/main/plugin/upgrade', (_e, identifier, path) => {
  return pluginManager.upgrade(identifier, path)
})

ipcMain.handle('/main/plugin/uninstall', (_e, identifier) => {
  return pluginManager.uninstall(identifier, false)
})

ipcMain.handle('/main/plugin/toggle-install', () => {
  const path = dialog.showOpenDialogSync({
    title: '请选择插件安装包',
    buttonLabel: '选择',
    properties: ['openFile'],
    filters: [{ name: 'Plugin', extensions: ['zip'] }]
  })
  const p = path?.[0]
  if (!p) return

  return openApp(
    {
      type: 'builtin',
      id: '0',
      desktopId: '',
      x: -1,
      y: -1,
      row: -1,
      column: -1,
      name: '安装插件',
      icon: '',
      sortIndex: 0,
      parentId: null,
      meta: {
        builtinId: BUILTIN_KEY.PLUGIN,
        width: 850,
        height: 620,
        minWidth: 850,
        minHeight: 620
      }
    },
    {
      path: p
    }
  )
})

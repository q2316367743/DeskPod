import { ipcMain } from 'electron'
import { quickManager } from '$/global/BeanFactory'

// 获取全部的快应用
ipcMain.handle('/main/quick/list', () => {
  return quickManager.list()
})

ipcMain.handle('/main/quick/install', (_e, form) => {
  return quickManager.install(form)
})

ipcMain.handle('/main/quick/upgrade', (_e, id, form) => {
  return quickManager.upgrade(id, form)
})

ipcMain.handle('/main/quick/uninstall', (_e, id) => {
  return quickManager.uninstall(id)
})

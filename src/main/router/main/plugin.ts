import { ipcMain } from 'electron'
import { pluginManager } from '$/global/BeanFactory'

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
  return pluginManager.uninstall(identifier)
})

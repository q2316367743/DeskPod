import { ipcMain } from 'electron'
import { taskbarManager } from '$/global/BeanFactory'

ipcMain.handle('/main/taskbar/list', () => {
  return taskbarManager.list()
})

ipcMain.handle('/main/taskbar/toggle', (_e, id) => {
  return taskbarManager.toggle(id)
})

ipcMain.handle('/main/taskbar/close', (_e, id) => {
  return taskbarManager.close(id)
})

import { dialog, ipcMain, shell } from 'electron'

ipcMain.handle('/main/support/dialog/showOpenDialogSync', (_e, options) => {
  return dialog.showOpenDialogSync(options)
})

ipcMain.handle('/main/support/shell/openExternal', (_e, url) => {
  return shell.openExternal(url)
})
ipcMain.handle('/main/support/shell/openPath', (_e, path) => {
  return shell.openPath(path)
})

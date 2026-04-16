import { dialog, ipcMain } from 'electron'


ipcMain.handle('/main/support/shellOpenDialog', (_e, options) => {
  return dialog.showOpenDialogSync(options)
})

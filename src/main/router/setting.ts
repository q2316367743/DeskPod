import { ipcMain } from 'electron'
import { getMainWindow, settingManager } from '$/global/BeanFactory'
import { SYSTEM_EVENT } from '@common/global'

ipcMain.handle('/main/setting/all', () => {
  return settingManager.all()
})

ipcMain.handle('/main/setting/set', async (_event, key, value) => {
  await settingManager.set(key, value)
  getMainWindow()?.webContents.send(SYSTEM_EVENT.SETTING_CHANGE, key, value)
})
ipcMain.handle('/main/setting/model-list', () => {
  return settingManager.listAiModel()
})
ipcMain.handle('/main/setting/model-add', (_event, model) => {
  return settingManager.addAiModel(model)
})
ipcMain.handle('/main/setting/model-delete', (_event, id) => {
  return settingManager.deleteAiModel(id)
})
ipcMain.handle('/main/setting/bg-image-list', (_event, theme) => {
  return settingManager.listBgImage(theme)
})

ipcMain.handle('/main/setting/bg-image-upload', async (_event, theme, path) => {
  return settingManager.uploadBgImage(theme, path)
})
ipcMain.handle('/main/setting/bg-image-delete', async (_event, path) => {
  return settingManager.deleteBgImage(path)
})

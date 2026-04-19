import { ipcMain } from 'electron'
import { getMainWindow, settingManager } from '$/global/BeanFactory'

ipcMain.handle('/main/setting/all', () => {
  return settingManager.all()
})

ipcMain.handle('/main/setting/set', async (_event, key, value) => {
  await settingManager.set(key, value)
  getMainWindow()?.emit('/event/setting/change', key, value)
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

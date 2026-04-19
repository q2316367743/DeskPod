import { ipcMain } from 'electron'
import { getMainWindow, settingManager } from '$/global/BeanFactory'

ipcMain.on('/main/setting/all', () => {
  return settingManager.all()
})

ipcMain.on('/main/setting/set', async (_event, key, value) => {
  await settingManager.set(key, value)
  getMainWindow()?.emit('/event/setting/change', key, value)
})
ipcMain.on('/main/setting/model-list', () => {
  return settingManager.listAiModel()
})
ipcMain.on('/main/setting/model-add', (_event, model) => {
  return settingManager.addAiModel(model)
})
ipcMain.on('/main/setting/model-delete', (_event, id) => {
  return settingManager.deleteAiModel(id)
})
ipcMain.on('/main/setting/bg-image-list', (_event, theme) => {
  return settingManager.listBgImage(theme)
})

ipcMain.on('/main/setting/bg-image-upload', async (_event, theme, path) => {
  return settingManager.uploadBgImage(theme, path)
})
ipcMain.on('/main/setting/bg-image-delete', async (_event, path) => {
  return settingManager.deleteBgImage(path)
})

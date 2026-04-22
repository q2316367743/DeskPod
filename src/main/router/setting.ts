import { ipcMain, screen } from 'electron'
import { settingManager } from '$/global/BeanFactory'
import { getMainWindow } from '$/module/desktop'
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

ipcMain.handle('/main/setting/get-displays', () => {
  const displays = screen.getAllDisplays()
  return displays.map((display) => ({
    id: display.id,
    bounds: display.bounds,
    size: display.size,
    scaleFactor: display.scaleFactor,
    label: `${display.bounds.x},${display.bounds.y} (${display.size.width}x${display.size.height})`
  }))
})

ipcMain.handle('/main/setting/capture-display', async (_event, displayId: number) => {
  const displays = screen.getAllDisplays()
  const target = displays.find((d) => d.id === displayId)
  if (!target) {
    throw new Error(`Display ${displayId} not found`)
  }
  const screenshot = await getMainWindow()?.webContents.capturePage()
  if (!screenshot) {
    return null
  }
  const { x, y, width, height } = target.bounds
  const cropped = screenshot.crop({ x, y, width, height })
  return cropped.toDataURL()
})

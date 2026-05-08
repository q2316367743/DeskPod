import { ipcMain } from 'electron'
import { lmdbManager } from '$/global/BeanFactory'

ipcMain.handle('/app/db/main/keys', () => {
  return lmdbManager.mainKeys()
})

ipcMain.handle('/app/db/main/value', (_e, key) => {
  return lmdbManager.getMainValue(key)
})

ipcMain.handle('/app/db/main/put', (_e, key, value) => {
  return lmdbManager.setMainValue(key, value)
})

ipcMain.handle('/app/db/main/delete', (_e, key) => {
  return lmdbManager.deleteMainValue(key)
})

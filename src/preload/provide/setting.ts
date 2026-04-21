import { ipcRenderer } from 'electron'
import { AiModelSetting, Setting } from '@common/types'
import { SYSTEM_EVENT } from '@common/global'

export const settingAPI = {
  onChange: (callback: () => void) => {
    ipcRenderer.on(SYSTEM_EVENT.SETTING_CHANGE, callback)
  },
  all: (): Promise<Setting> => {
    return ipcRenderer.invoke('/main/setting/all')
  },
  set<K extends keyof Setting>(key: K, value: Setting[K]) {
    return ipcRenderer.invoke('/main/setting/set', key, value)
  },
  listAiModel(): Promise<Array<AiModelSetting>> {
    return ipcRenderer.invoke('/main/setting/model-list')
  },
  addAiModel(model: AiModelSetting): Promise<void> {
    return ipcRenderer.invoke('/main/setting/model-add', model)
  },
  deleteAiModel(id: string): Promise<void> {
    return ipcRenderer.invoke('/main/setting/model-delete', id)
  },
  listBgImage(theme: 'light' | 'dark'): Promise<Array<string>> {
    return ipcRenderer.invoke('/main/setting/bg-image-list', theme)
  },
  uploadBgImage(theme: 'light' | 'dark', path: string): Promise<void> {
    return ipcRenderer.invoke('/main/setting/bg-image-upload', theme, path)
  },
  deleteBgImage(path: string): Promise<void> {
    return ipcRenderer.invoke('/main/setting/bg-image-delete', path)
  }
}

import { ipcRenderer } from 'electron'
import { QuickAppCore } from '@common/types'

export const quickAPI = {
  list: () => {
    return ipcRenderer.invoke('/main/quick/list')
  },
  install: (form: QuickAppCore) => {
    return ipcRenderer.invoke('/main/quick/install', form)
  },
  upgrade: (id: string, form: QuickAppCore) => {
    return ipcRenderer.invoke('/main/quick/upgrade', id, form)
  },
  uninstall: (id: string) => {
    return ipcRenderer.invoke('/main/quick/uninstall', id)
  }
}

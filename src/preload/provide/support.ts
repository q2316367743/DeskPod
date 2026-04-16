import { ipcRenderer } from 'electron'


export const supportAPI = {
  shellOpenDialog: (options: unknown) => {
    return ipcRenderer.invoke('/main/support/shellOpenDialog', options)
  }
}

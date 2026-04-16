import { ipcRenderer } from 'electron'
import { platform } from 'node:os'

export const supportAPI = {
  isWindows: () => {
    return platform() === 'win32'
  },
  shellOpenDialog: (options: unknown) => {
    return ipcRenderer.invoke('/main/support/shellOpenDialog', options)
  }
}

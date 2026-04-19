import { ipcRenderer } from 'electron'
import { platform } from 'node:os'
import { join, basename, extname, dirname, sep } from 'path'

export const supportAPI = {
  isWindows: () => {
    return platform() === 'win32'
  },
  shellOpenDialog: (options: unknown) => {
    return ipcRenderer.invoke('/main/support/shellOpenDialog', options)
  },
  join,
  basename,
  extname,
  dirname,
  sep
}

import { ipcRenderer } from 'electron'
import { platform } from 'node:os'
import { join, basename, extname, dirname, sep } from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import { FileItemView } from '@common/views'

export const supportAPI = {
  isWindows: () => {
    return platform() === 'win32'
  },
  path: {
    join,
    basename,
    extname,
    dirname,
    sep
  },
  fs: {
    readdir: async (path: string) => {
      const list = await readdir(path)
      const results = new Array<FileItemView>()
      for (const item of list) {
        const p = join(path, item)
        const stats = await stat(p)
        results.push({
          name: item,
          path: p,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          size: stats.size,
          birthtime: stats.birthtime,
          mtime: stats.mtime
        })
      }
      return results
    }
  },
  dialog: {
    showOpenDialogSync: (options: unknown) => {
      return ipcRenderer.invoke('/main/support/dialog/showOpenDialogSync', options)
    }
  },
  shell: {
    openExternal: (url: string) => {
      return ipcRenderer.invoke('/main/support/shell/openExternal', url)
    },
    openPath: (path: string) => {
      return ipcRenderer.invoke('/main/support/shell/openPath', path)
    }
  }
}

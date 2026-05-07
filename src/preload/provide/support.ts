import { ipcRenderer } from 'electron'
import { platform } from 'node:os'
import { join, basename, extname, dirname, sep } from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { FileItemView } from '@common/views'
import { logAPI } from '~/provide/log'

const p = platform()
const isWindows = p === 'win32'
const isMacOS = p === 'darwin'
const isLinux = p === 'linux'

export const supportAPI = {
  isWindows: () => isWindows,
  isMacOS: () => isMacOS,
  isLinux: () => isLinux,
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
        try {
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
        } catch (e) {
          logAPI.error(`处理文件「${p}」报错`, e)
        }
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
  },
  url: {
    pathToHref: (path: string) => {
      return pathToFileURL(path).href
    }
  },
  app: {
    main: {
      toggleVisible: (): Promise<boolean> => {
        return ipcRenderer.invoke('/app/main/toggle-visible')
      }
    }
  }
}

import { shell } from 'electron'

import { defineApi } from '$/global/DefineApi'
import { checkBasePermission } from '$/module/plugin'

export default [
  defineApi<{ url: string }>('plugin:opener|open_url', async (args, _o, p) => {
    await checkBasePermission(p, 'opener', 'open-url')
    const { url } = args
    await shell.openExternal(url)
    return Promise.resolve()
  }),
  defineApi<{ path: string; with?: string }>('plugin:opener|open_path', async (args, _o, p) => {
    await checkBasePermission(p, 'opener', 'open-path')
    const { path } = args
    await shell.openPath(path)
    return Promise.resolve()
  }),
  defineApi<{ paths: Array<string> }>('plugin:opener|reveal_item_in_dir', async (args, _o, p) => {
    await checkBasePermission(p, 'opener', 'reveal-item-in-dir')
    const { paths } = args
    for (const path of paths) {
      shell.showItemInFolder(path)
    }
    return Promise.resolve()
  })
]

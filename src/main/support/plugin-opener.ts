import { shell } from 'electron'

import { defineApi } from '$/types/DefineApi'

export default [
  defineApi<{ url: string }>('plugin:opener|open_url', async (args) => {
    const { url } = args
    await shell.openExternal(url)
    return Promise.resolve()
  }),
  defineApi<{ paths: Array<string> }>('plugin:opener|reveal_item_in_dir', async (args) => {
    const { paths } = args
    for (const path of paths) {
      shell.showItemInFolder(path)
    }
    return Promise.resolve()
  })
]

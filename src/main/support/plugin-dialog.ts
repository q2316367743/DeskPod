import { defineApi } from '$/types/DefineApi'
import { dialog } from 'electron'
import { DialogFilter } from '@tauri-apps/plugin-dialog'

interface OpenDialogOptions {
  title?: string
  filters?: DialogFilter[]
  defaultPath?: string
  multiple?: boolean
  directory?: boolean
  recursive?: boolean
  canCreateDirectories?: boolean
}
interface SaveDialogOptions {
  title?: string
  filters?: DialogFilter[]
  defaultPath?: string
  canCreateDirectories?: boolean
}

export default [
  defineApi<{ options: OpenDialogOptions }>('plugin:dialog|open', async (args) => {
    const { filePaths } = await dialog.showOpenDialog({
      ...args.options,
      properties: [
        args.options.directory ? 'openDirectory' : 'openFile',
        args.options.multiple ? 'multiSelections' : 'openFile',
        args.options.canCreateDirectories ? 'createDirectory' : 'openFile'
      ]
    })
    if (args.options.multiple) return filePaths
    else return filePaths ? (filePaths[0] ? filePaths[0] : null) : null
  }),
  defineApi<{ options: SaveDialogOptions }>('plugin:dialog|save', async (args) => {
    const { filePath } = await dialog.showSaveDialog({
      ...args.options,
      properties: args.options.canCreateDirectories ? ['createDirectory'] : []
    })
    return filePath ? filePath : null
  })
]

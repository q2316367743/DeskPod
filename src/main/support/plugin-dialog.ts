import { defineApi } from '$/global/DefineApi'
import { dialog } from 'electron'
import { DialogFilter } from '@tauri-apps/plugin-dialog'
import { checkBasePermission } from '$/module/plugin'

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

export type MessageDialogDefaultButtons = 'Ok' | 'OkCancel' | 'YesNo' | 'YesNoCancel'

interface MessageDialogOptions {
  message: string
  title?: string
  kind?: 'info' | 'warning' | 'error'
  /**
   * The label of the Ok button.
   *
   * @deprecated Use {@linkcode MessageDialogOptions.buttons} instead.
   */
  okLabel?: string
  buttons?:
    | MessageDialogDefaultButtons
    | { OkCancelCustom?: [string, string]; YesNoCancelCustom?: [string, string, string] }
}

export default [
  defineApi<{ options: OpenDialogOptions }>('plugin:dialog|open', async (args, _o, p) => {
    await checkBasePermission(p, 'dialog', 'open')
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
  defineApi<{ options: SaveDialogOptions }>('plugin:dialog|save', async (args, _o, p) => {
    await checkBasePermission(p, 'dialog', 'save')
    const { filePath } = await dialog.showSaveDialog({
      ...args.options,
      properties: args.options.canCreateDirectories ? ['createDirectory'] : []
    })
    return filePath ? filePath : null
  }),
  defineApi<{ options: MessageDialogOptions }>('plugin:dialog|message', async (args, _o, p) => {
    await checkBasePermission(p, 'dialog', 'message')
    const { options } = args
    let buttons: Array<string> | undefined = undefined
    if (options.buttons) {
      if (options.buttons === 'Ok') {
        buttons = ['Ok']
      } else if (options.buttons === 'OkCancel') {
        buttons = ['Cancel', 'Ok']
      } else if (options.buttons === 'YesNo') {
        buttons = ['No', 'Yes']
      } else if (options.buttons === 'YesNoCancel') {
        buttons = ['Cancel', 'No', 'Yes']
      } else if (options.buttons.OkCancelCustom) {
        buttons = [options.buttons.OkCancelCustom[0], options.buttons.OkCancelCustom[1]]
      } else if (options.buttons.YesNoCancelCustom) {
        buttons = [
          options.buttons.YesNoCancelCustom[0],
          options.buttons.YesNoCancelCustom[1],
          options.buttons.YesNoCancelCustom[2]
        ]
      }
    }
    const result = dialog.showMessageBoxSync({
      title: options.title,
      message: options.message,
      type: options.kind,
      buttons: buttons
    })
    return buttons ? buttons[result] : {}
  })
]

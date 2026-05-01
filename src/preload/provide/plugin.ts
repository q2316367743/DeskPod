import { PluginEntityWrap, PluginVerifyResult } from '@common/types'
import { ipcRenderer } from 'electron'
import { join } from 'path'

export const pluginAPI = {
  list: (): Promise<Array<PluginEntityWrap>> => {
    return ipcRenderer.invoke('/main/plugin/list')
  },
  verify: (path: string): Promise<PluginVerifyResult> => {
    return ipcRenderer.invoke('/main/plugin/verify', path)
  },
  install: (path: string): Promise<void> => {
    return ipcRenderer.invoke('/main/plugin/install', path)
  },
  upgrade: (identifier: string, path: string): Promise<void> => {
    return ipcRenderer.invoke('/main/plugin/upgrade', identifier, path)
  },
  uninstall: (identifier: string): Promise<void> => {
    return ipcRenderer.invoke('/main/plugin/uninstall', identifier)
  },
  toggleInstall: () => {
    return ipcRenderer.invoke('/main/plugin/toggle-install')
  },
  preload: () => {
    return join(__dirname, 'plugin.js')
  }
}

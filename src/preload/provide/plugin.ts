import { PluginEntityWrap, PluginVerifyResult } from '@common/types/PluginEntity'
import { ipcRenderer } from 'electron'

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
  }
}

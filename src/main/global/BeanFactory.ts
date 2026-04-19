// 插件管理器
import { PluginManager } from '$/module/plugin'
import { QuickManager } from '$/module/quick'
import { DesktopManager } from '$/module/desktop'
import { SettingManager } from '$/module/setting'
import { BrowserWindow } from 'electron'

export const pluginManager = new PluginManager()
export const quickManager = new QuickManager()
export const desktopManager = new DesktopManager()
export const settingManager = new SettingManager()

let mainWindow: BrowserWindow | undefined = undefined
export const setMainWindow = (win: BrowserWindow) => (mainWindow = win)
export const getMainWindow = () => mainWindow

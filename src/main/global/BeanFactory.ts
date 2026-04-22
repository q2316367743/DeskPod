// 插件管理器
import { QuickManager } from '$/module/quick'
import { DatabaseManager, PluginManager, StoreManager } from '$/module/plugin'
import { DesktopManager, SettingManager } from '$/module/desktop'

export const pluginManager = new PluginManager()
export const quickManager = new QuickManager()
export const desktopManager = new DesktopManager()
export const settingManager = new SettingManager()

export const databaseManager = new DatabaseManager()
export const storeManager = new StoreManager()

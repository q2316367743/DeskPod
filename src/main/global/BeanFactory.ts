import { QuickManager } from '$/module/quick'
import { DatabaseManager, PluginManager, StoreManager } from '$/module/plugin'
import { DesktopManager, TaskbarManager } from '$/module/desktop'
import { SettingManager } from '$/module/setting'
import { LmdbManager } from '$/lib/db'

export const pluginManager = new PluginManager()
export const quickManager = new QuickManager()
export const desktopManager = new DesktopManager()
export const settingManager = new SettingManager()

export const databaseManager = new DatabaseManager()
export const storeManager = new StoreManager()
export const taskbarManager = new TaskbarManager()

export const lmdbManager = new LmdbManager()

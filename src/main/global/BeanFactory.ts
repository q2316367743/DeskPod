// 插件管理器
import { PluginManager } from '$/module/plugin'
import { QuickManager } from '$/module/quick'
import { DesktopManager } from '$/module/desktop'

export const pluginManager = new PluginManager()
export const quickManager = new QuickManager()
export const desktopManager = new DesktopManager()

export const SYSTEM_EVENT = {
  SETTING_CHANGE: '/event/setting/change',
  DESKTOP_CHANGE: '/event/setting/change'
}

export const PARTITION = {
  PLUGIN: (pluginId: string) => `persist:plugin-${pluginId}`,
  QUICK: (quickId: string) => `persist:quick-${quickId}`,
  // builtin
  BUILTIN: 'persist:builtin',
  LINK: 'persist:link'
}

export const BUILTIN_KEY = {
  ADD: 'add',
  // 插件安装页面
  PLUGIN: 'plugin',
  SETTING: 'setting'
}

// lmdb 主程序使用的键
export const LMDB_MAIN_KEY = {
  // 快应用列表
  QUICK: '/list/quick',
  // 桌面数据
  DESKTOP: '/item/desktop',
  // 设置数据
  SETTING: '/item/setting'
}

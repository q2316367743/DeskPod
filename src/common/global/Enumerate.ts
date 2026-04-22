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
  QUICK: 'quick',
  PLUGIN: 'plugin',
  SETTING: 'setting'
}

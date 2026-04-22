export const APP_ID = 'xyz.esion.desk-pod'
export const APP_NAME = 'DeskPod'
export const APP_DESC = 'DeskPod是一个强大的副屏软件'
export const APP_AUTHOR = 'Esion'
export const APP_GITHUB = 'https://github.com/q2316367743/desk-pod'
export const APP_VERSION = '1.0.0'

export const APP_PASSWORD = 'FmH24q7!*DDUcd'

/**
 * 单元格尺寸
 */
export const CELL_SIZE = 96

export const SYSTEM_EVENT = {
  SETTING_CHANGE: '/event/setting/change',
  DESKTOP_CHANGE: '/event/setting/change'
}

export const PARTITION = {
  PLUGIN: (pluginId: string) => `persist:plugin-${pluginId}`,
  QUICK: (quickId: string) => `persist:quick-${quickId}`,
  // builtin
  BUILTIN: 'persist:builtin'
}

import { defineApi } from '$/global/DefineApi'
import { checkBasePermission, getPluginWindowByLabel } from '$/module/plugin'
import { app } from 'electron'

export default [
  defineApi('plugin:app|version', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:app', 'version')
    return p.entity.version
  }),
  defineApi('plugin:app|name', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:app', 'name')
    return p.entity.productName
  }),
  defineApi('plugin:app|tauri_version', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:app', 'tauri-version')
    return app.getVersion()
  }),
  defineApi('plugin:app|identifier', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:app', 'identifier')
    return p.entity.identifier
  }),
  defineApi('plugin:app|app_show', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:app', 'app-show')
    const pw = getPluginWindowByLabel(p.pluginId, p.label)
    if (!pw) return Promise.reject(new Error('插件窗口未找到'))
    pw.window.show()
  }),
  defineApi('plugin:app|app_hide', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:app', 'app-hide')
    const pw = getPluginWindowByLabel(p.pluginId, p.label)
    if (!pw) return Promise.reject(new Error('插件窗口未找到'))
    pw.window.hide()
  }),
  defineApi('plugin:app|fetch_data_store_identifiers', async () => {
    // 获取数据存储标识符，16个数字的数组
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }),
  defineApi<Array<number>>('plugin:app|remove_data_store', async () => {}),
  defineApi<Array<number>>('plugin:app|default_window_icon', async () => {
    return ''
  }),
  defineApi('plugin:app|set_app_theme', async () => {
    return Promise.reject(new Error('插件无法修改主题'))
  }),
  defineApi<Array<number>>('plugin:app|set_dock_visibility', async () => {
    return Promise.reject(new Error('插件无法修改 dock 是否显示'))
  }),
  defineApi<Array<number>>('plugin:app|bundle_type', async () => {
    return Promise.reject(new Error('无法获取应用打包方式'))
  }),
  defineApi<Array<number>>('plugin:app|supports_multiple_windows', async () => {
    return true
  })
]

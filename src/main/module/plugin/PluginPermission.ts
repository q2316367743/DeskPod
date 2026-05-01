import { dialog } from 'electron'
import { appPluginConfigPath } from '$/global/Constant'
import { writeFile } from 'node:fs/promises'
import { ApiPayload } from '$/global/DefineApi'

class PermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionError'
  }
}

// 默认权限
const defaultCapability: Record<string, Array<string>> = {
  log: ['log:allow-log'],
  dialog: ['dialog:allow-message', 'dialog:allow-save', 'dialog:allow-open'],
  opener: ['opener:allow-open-url', 'opener:allow-reveal-item-in-dir', 'opener:allow-default-urls'],
  sql: ['sql:allow-close', 'sql:allow-load', 'sql:allow-select']
}

export async function checkBasePermission(payload: ApiPayload, module: string, capability: string) {
  const plugin = payload.entity
  const allow = `${module}:allow-${capability}`
  const deny = `${module}:deny-${capability}`
  const { capabilities } = plugin
  if (capabilities.includes(allow)) return
  if (capabilities.includes(deny)) {
    dialog.showErrorBox('权限不允许', '该插件被禁止了此能力')
    return Promise.reject(new PermissionError('该插件被禁止了此能力'))
  }
  // 存在默认权限
  if (defaultCapability[module]?.includes(allow)) {
    // 默认权限
    const defaultPermission = `${module}:default`
    if (capabilities.includes(defaultPermission)) return
  }
  // 都不包含，请求权限
  const result = dialog.showMessageBoxSync({
    type: 'question',
    title: '权限请求',
    message: `插件 ${plugin.productName} 请求 ${module} 模块的 ${capability} 能力，是否允许？`,
    buttons: ['拒绝', '允许', '仅本次允许']
  })
  if (result === 2) {
    // 仅本次允许
    return
  }
  // 增加能力
  if (result === 0) {
    // 禁止
    capabilities.push(deny)
  } else if (result === 1) {
    // 允许
    capabilities.push(allow)
  }

  // 保存能力
  const configPath = appPluginConfigPath(plugin.identifier)
  await writeFile(configPath, JSON.stringify(plugin), 'utf-8')
  if (result === 0) {
    return Promise.reject(new PermissionError('该插件被拒绝了此能力'))
  }
}

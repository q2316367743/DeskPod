import { PluginEntityWrap } from '@common/types'

export interface ApiPayload {
  // 插件的
  pluginId: string
  // 插件的窗口标签
  label: string
  // 插件实体
  entity: PluginEntityWrap
}

export interface ApiFunc<A, O, R> {
  (args: A, options: O | undefined, payload: ApiPayload): Promise<R>
}

/**
 * 定义一个插件
 */
export function defineApi<A = Record<string, unknown>, O = Record<string, unknown>, R = unknown>(
  cmd: string,
  plugin: ApiFunc<A, O, R>
) {
  return { cmd, plugin }
}

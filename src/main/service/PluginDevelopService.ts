import { useSql } from '$/lib/sql'
import { PluginDevelop } from '@common/entity'

export const pluginDevelopList = () => {
  return useSql().query<PluginDevelop>('plugin_develop').list()
}

export const pluginDevelopGet = (id: string) => {
  return useSql().query<PluginDevelop>('plugin_develop').eq('id', id).get()
}



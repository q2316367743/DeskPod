import { BaseEntity } from '@common/entity/BaseEntity'

/**
 * 插件开发者
 */
export interface PluginDevelop extends BaseEntity {
  name: string
  // 配置文件路径
  path: string
}

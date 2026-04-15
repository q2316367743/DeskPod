export interface PluginEntity {
  identifier: string
  productName: string
  version: string
  main?: {
    label: string
    title: string
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
  }
  /**
   * 小部件
   */
  weight?: {
    label: string
    title: string
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
  },
  // 权限
  capabilities: Array<{}>
}

/**
 * 插件管理器
 */
export class PluginManager {
  /**
   * 根据插件 ID 获取插件实体
   */
  getById(id: string): PluginEntity | null {
    console.log(id)
    return null
  }
}

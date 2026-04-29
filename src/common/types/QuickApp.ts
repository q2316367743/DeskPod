import { BaseEntity } from '@common/entity'

/**
 * - `window`: 独立窗口
 * - `widget`: 小部件
 */
export type QuickAppType = 'window' | 'widget'

/**
 * - `ai`: 人工智能生成
 * - `html`: html文件
 * - `zip`: zip压缩包
 */
export type QuickAppFrom = 'ai' | 'html' | 'zip'

export interface QuickAppCore {
  name: string

  // 描述
  description?: string

  /**
   * 入口文件
   */
  entry: string
  /**
   * 图标文件
   */
  icon: string

  /**
   * 来源
   */
  from: QuickAppFrom
  /**
   * 类型：独立窗口(window) / 小部件(widget)
   */
  type: QuickAppType
  /**
   * 宽度，独立窗口 px，小部件列数
   */
  width: number
  /**
   * 高度，独立窗口 px，小部件行数1
   */
  height: number
  min_width: number
  min_height: number

  /**
   * 根目录，安装后才有
   */
  root: string
}

/**
 * 所谓的快应用就是 webapp，纯前端应用
 */
export interface QuickApp extends BaseEntity, QuickAppCore {}

export interface AiModelSetting {
  id: string
  modelId: string
  modelName: string
  apiOrigin: string
  apiKey: string
}

/**
 * 模式
 *
 * - launch：启动器模式，通过快捷键触发
 * - screen：副屏模式，常驻
 */
export type SettingMode = 'launch' | 'screen'

export interface Setting {
  // 开机自启
  autoStart: boolean
  // 显示界面显示器ID
  displayId: number
  // 主题
  theme: 'auto' | 'dark' | 'light'
  // 背景图片 - 明亮模式
  backgroundImageLight: string
  // 背景图片 - 暗黑模式
  backgroundImageDark: string
  // 自定义 AI 模型
  models: Array<AiModelSetting>
}

export function defaultSetting(): Setting {
  return {
    autoStart: false,
    displayId: 0,
    theme: 'auto',
    backgroundImageLight: '',
    backgroundImageDark: '',
    models: []
  }
}

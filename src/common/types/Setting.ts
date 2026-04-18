export interface AiModelSetting {
  modelId: string
  modelName: string
  apiOrigin: string
  apiKey: string
}

export interface Setting {
  // 开机自启
  autoStart: boolean
  // 显示界面快捷键
  shortcutKey: string
  // 主题
  theme: 'auto' | 'dark' | 'light'
  // 自定义 AI 模型
  models: Array<AiModelSetting>
}

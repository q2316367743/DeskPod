import { defineApi } from '$/global/DefineApi'

export default [
  defineApi('plugin:app|set_app_theme', async () => {
    console.log('设置主题')
    return true
  })
]

import { defineApi } from '$/global/DefineApi'
import { createPluginWindow } from '$/module/plugin'
import { WindowOptions } from '@common/types'

interface BaseArgs {
  options: WindowOptions
}

// 此处有问题，window 和 webview 不一样
export default [
  // definePlugin<BaseArgs>('plugin:window|create', async (args, _o, payload) => {
  //   const { options } = args
  //   if (!options.label) return Promise.reject(Error('请提供插件标签'))
  //   if (!options.url) return Promise.reject(Error('请提供插件地址'))
  //   // 创建窗口
  //   const bw = new BrowserWindow(options)
  //   // 加载文件
  //   await bw.loadFile(
  //     join(app.getPath('appData'), 'plugins', payload.pluginId, options.url)
  //   )
  //   browserWindowMap.set(`${payload.pluginId}|${options.label}`, bw)
  // }),
  defineApi<BaseArgs>('plugin:webview|create_webview_window', async (args, _o, payload) => {
    const { options } = args
    await createPluginWindow(options, payload.pluginId)
  })
]

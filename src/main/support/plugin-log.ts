import { defineApi } from '$/global/DefineApi'

interface BaseArgs {
  level: number
  message: string
  location: string
}

export default [
  defineApi<BaseArgs>('plugin:log|log', async (args) => {
    // 插件日志
    const {
      // Trace|Debug|Info|Warn|Error
      level,
      message,
      location
    } = args
    const msg = `[${location}] ${message}`
    if (level === 2) console.debug(msg)
    else if (level === 3) console.info(msg)
    else if (level === 4) console.warn(msg)
    else if (level === 5) console.error(msg)
    else console.trace(msg)
  })
]

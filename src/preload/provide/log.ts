import log from 'electron-log/renderer' // 注意：v5版本必须加 /renderer 后缀

export const logAPI = {
  debug: (...params: Array<unknown>) => log.debug(...params),
  info: (...params: Array<unknown>) => log.info(...params),
  warn: (...params: Array<unknown>) => log.warn(...params),
  error: (...params: Array<unknown>) => log.error(...params)
}

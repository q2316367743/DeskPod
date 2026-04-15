import { join, basename, extname, isAbsolute, normalize, resolve } from 'node:path'
import { app } from 'electron'
import { defineApi } from '$/types/DefineApi'

export enum BaseDirectory {
  /**
   * @see audioDir for more information.
   */
  Audio = 1,
  /**
   * @see cacheDir for more information.
   */
  Cache = 2,
  /**
   * @see configDir for more information.
   */
  Config = 3,
  /**
   * @see dataDir for more information.
   */
  Data = 4,
  /**
   * @see localDataDir for more information.
   */
  LocalData = 5,
  /**
   * @see documentDir for more information.
   */
  Document = 6,
  /**
   * @see downloadDir for more information.
   */
  Download = 7,
  /**
   * @see pictureDir for more information.
   */
  Picture = 8,
  /**
   * @see publicDir for more information.
   */
  Public = 9,
  /**
   * @see videoDir for more information.
   */
  Video = 10,
  /**
   * @see resourceDir for more information.
   */
  Resource = 11,
  /**
   * @see tempDir for more information.
   */
  Temp = 12,
  /**
   * @see appConfigDir for more information.
   */
  AppConfig = 13,
  /**
   * @see appDataDir for more information.
   */
  AppData = 14,
  /**
   * @see appLocalDataDir for more information.
   */
  AppLocalData = 15,
  /**
   * @see appCacheDir for more information.
   */
  AppCache = 16,
  /**
   * @see appLogDir for more information.
   */
  AppLog = 17,
  /**
   * @see desktopDir for more information.
   */
  Desktop = 18,
  /**
   * @see executableDir for more information.
   */
  Executable = 19,
  /**
   * @see fontDir for more information.
   */
  Font = 20,
  /**
   * @see homeDir for more information.
   */
  Home = 21,
  /**
   * @see runtimeDir for more information.
   */
  Runtime = 22,
  /**
   * @see templateDir for more information.
   */
  Template = 23
}

/**
 * 获取目录
 */
export const getDirectory = (pluginId: string, directory: BaseDirectory) => {
  switch (directory) {
    case 1:
      return app.getPath('music')
    case 2:
      return app.getPath('cache')
    case 3:
      return app.getPath('config')
    case 4:
      return app.getPath('userData')
    case 5:
      return app.getPath('localData')
    case 6:
      return app.getPath('documents')
    case 7:
      return app.getPath('downloads')
    case 8:
      return app.getPath('pictures')
    case 9:
      return app.getPath('public')
    case 10:
      return app.getPath('videos')
    case 11:
      // $RESOURCE
      return join(app.getPath('appData'), 'plugins', pluginId, 'resource'))
    case 12:
      return app.getPath('temp')
    case 13:
      // $APP_CONFIG
      return join(app.getPath('appData'), 'plugins', pluginId, 'config')
    case 14:
      // $APP_DATA
      return join(app.getPath('appData'), 'plugins', pluginId, 'data')
    case 15:
      // $APP_LOCAL_DATA
      return join(app.getPath('appData'), 'plugins', pluginId, 'localData')
    case 16:
      // $APP_CACHE
      return join(app.getPath('appData'), 'plugins', pluginId, 'cache')
    case 17:
      // $APP_LOG
      return join(app.getPath('appData'), 'plugins', pluginId, 'log')
    case 18:
      return app.getPath('desktop')
    case 19:
      return app.getPath('executable')
    case 20:
      return app.getPath('font')
    case 21:
      return app.getPath('home')
    case 22:
      // 运行时目录
      // $RUNTIME
      return join(app.getPath('appData'), 'plugins', pluginId, 'runtime')
    case 23:
      return app.getPath('temp')
    default:
      return join(app.getPath('appData'), 'plugins', pluginId, 'data')
  }
}

interface BaseArgs {
  path: string
}

export default [
  defineApi<{ paths: Array<string> }>('plugin:path|join', async (args) => {
    const { paths } = args
    return join(...paths)
  }),
  defineApi<{ path: string; directory: number }>(
    'plugin:path|resolve_directory',
    async (args, _o, payload) => {
      const { path, directory } = args
      const dir = getDirectory(payload.pluginId, directory)
      if (!path) {
        return dir
      } else if (!directory) {
        return resolve(__dirname, path)
      }
      return join(dir, path)
    }
  ),
  defineApi<BaseArgs>('plugin:path|basename', async (args) => {
    const { path } = args
    return basename(path)
  }),
  defineApi<BaseArgs>('plugin:path|extname', async (args) => {
    const { path } = args
    return extname(path)
  }),
  defineApi<BaseArgs>('plugin:path|is_absolute', async (args) => {
    const { path } = args
    return isAbsolute(path)
  }),
  defineApi<BaseArgs>('plugin:path|normalize', async (args) => {
    const { path } = args
    return normalize(path)
  }),
  defineApi<BaseArgs>('plugin:path|resolve', async (args) => {
    const { path } = args
    return resolve(path)
  })
]

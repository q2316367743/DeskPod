import { join, basename, extname, isAbsolute, normalize, resolve } from 'node:path'
import { app } from 'electron'
import { defineApi } from '$/types/DefineApi'
import { pluginManager } from '$/global/BeanFactory'

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
  const entity = pluginManager.getById(pluginId);
  if (!entity) throw new Error(`pluginId ${pluginId} not found`)
  switch (directory) {
    case BaseDirectory.Audio:
      return app.getPath('music')
    case BaseDirectory.Document:
      return app.getPath('documents')
    case BaseDirectory.Download:
      return app.getPath('downloads')
    case BaseDirectory.Picture:
      return app.getPath('pictures')
    case BaseDirectory.Video:
      return app.getPath('videos')
    case BaseDirectory.Temp:
      return app.getPath('temp')
    case BaseDirectory.Resource:
      return join(entity.root, 'resource')
    case BaseDirectory.AppConfig:
      return join(entity.root, 'config')
    case BaseDirectory.AppData:
      return join(entity.root, 'data')
    case BaseDirectory.AppLocalData:
      return join(entity.root, 'localData')
    case BaseDirectory.AppCache:
      return join(entity.root, 'cache')
    case BaseDirectory.AppLog:
      return join(entity.root, 'log')
    case BaseDirectory.Runtime:
      return join(entity.root, 'runtime')
    case BaseDirectory.Desktop:
      return app.getPath('desktop')
    // case 20:
    //   return app.getPath('font')
    case BaseDirectory.Home:
      return app.getPath('home')
    default:
      throw new Error(`Unknown plugin ${pluginId} dir in ${directory}`)
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

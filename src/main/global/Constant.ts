import { join } from 'node:path'
import { mkdir, unlink } from 'node:fs/promises'
import { app } from 'electron'

export const APP_ID = 'xyz.esion.desk-pod'
export const APP_NAME = 'DeskPod'
export const APP_DESC = 'DeskPod是一个强大的副屏软件'
export const APP_AUTHOR = 'Esion'
export const APP_GITHUB = 'https://github.com/q2316367743/desk-pod'
export const APP_VERSION = '1.0.0'

export const APP_PASSWORD = 'FmH24q7!*DDUcd'


export const APP_DATA_DIR = app.getPath('appData')
export const APP_DATA_ASSET_DIR = join(APP_DATA_DIR, 'asset')
export const APP_DATA_DB_DIR = join(APP_DATA_DIR, 'db')
export const APP_DATA_STORE_DIR =  join(APP_DATA_DIR, 'store')

// 插件目录
export const APP_PLUGIN_DIR = join(APP_DATA_DIR, 'plugins')

export const appPluginConfigPath = (pluginId: string) =>
  join(APP_PLUGIN_DIR, pluginId, 'runtime', 'plugin.json')

// 创建一个插件的全部目录
export const createPluginDirs = async (pluginId: string) => {
  const baseDir = join(APP_PLUGIN_DIR, pluginId)
  const runtime = join(baseDir, 'runtime')
  await Promise.all([
    mkdir(runtime),
    // mkdir(join(baseDir, 'resource')),
    mkdir(join(baseDir, 'config')),
    mkdir(join(baseDir, 'data')),
    mkdir(join(baseDir, 'cache')),
    mkdir(join(baseDir, 'log')),
    mkdir(join(baseDir, 'localData'))
  ])
  return runtime
}

export const removePluginDirs = async (pluginId: string) => {
  const baseDir = join(APP_PLUGIN_DIR, pluginId)
  await Promise.all([
    unlink(join(baseDir, 'runtime')),
    // mkdir(join(baseDir, 'resource')),
    unlink(join(baseDir, 'config')),
    unlink(join(baseDir, 'data')),
    unlink(join(baseDir, 'cache')),
    unlink(join(baseDir, 'log')),
    unlink(join(baseDir, 'localData'))
  ])
}

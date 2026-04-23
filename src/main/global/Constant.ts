import { join } from 'node:path'
import { mkdir, rm } from 'node:fs/promises'
import { app } from 'electron'
import s0000 from '../../../resources/migrate/0000.sql?asset'
import { APP_ID } from '@common/global'

export const APP_DATA_DIR = join(app.getPath('appData'), APP_ID)

export const APP_DATA_ASSET_DIR = join(APP_DATA_DIR, 'asset')
export const APP_DATA_DB_DIR = join(APP_DATA_DIR, 'db')
export const APP_DATA_PLUGIN_DIR = join(APP_DATA_DIR, 'plugins')
export const APP_DATA_QUICK_DIR = join(APP_DATA_DIR, 'quick')

export const APP_DATA_DB_PATH = (filename: string) => join(APP_DATA_DB_DIR, filename + '.sqlite')

export const APP_DATA_ASSET_ICON_DIR = join(APP_DATA_ASSET_DIR, 'icon')

export const MAIN_MIGRATE_FILES = [
  {
    file: s0000,
    version: 0
  }
]

export const appDirInit = async () => {
  await Promise.all([
    mkdir(APP_DATA_PLUGIN_DIR, { recursive: true }),
    mkdir(APP_DATA_ASSET_DIR, { recursive: true }),
    mkdir(APP_DATA_DB_DIR, { recursive: true }),
    mkdir(APP_DATA_QUICK_DIR, { recursive: true })
  ])
}

export const appPluginConfigPath = (pluginId: string) =>
  join(APP_DATA_PLUGIN_DIR, pluginId, 'runtime', 'plugin.json')

// 创建一个插件的全部目录
export const createPluginDirs = async (pluginId: string) => {
  const baseDir = join(APP_DATA_PLUGIN_DIR, pluginId)
  const runtime = join(baseDir, 'runtime')
  await Promise.all([
    mkdir(runtime, { recursive: true }),
    // mkdir(join(baseDir, 'resource')),
    mkdir(join(baseDir, 'config'), { recursive: true }),
    mkdir(join(baseDir, 'data'), { recursive: true }),
    mkdir(join(baseDir, 'cache'), { recursive: true }),
    mkdir(join(baseDir, 'log'), { recursive: true }),
    mkdir(join(baseDir, 'localData'), { recursive: true })
  ])
  return runtime
}

export const removePluginDirs = async (pluginId: string) => {
  const baseDir = join(APP_DATA_PLUGIN_DIR, pluginId)
  await Promise.all([
    rm(join(baseDir, 'runtime'), { recursive: true, force: true }),
    // rm(join(baseDir, 'resource')),
    rm(join(baseDir, 'config'), { recursive: true, force: true }),
    rm(join(baseDir, 'data'), { recursive: true, force: true }),
    rm(join(baseDir, 'cache'), { recursive: true, force: true }),
    rm(join(baseDir, 'log'), { recursive: true, force: true }),
    rm(join(baseDir, 'localData'), { recursive: true, force: true })
  ])
}

export const createQuickAppDirs = async (quickAppId: string) => {
  const quickAppDir = join(APP_DATA_QUICK_DIR, quickAppId)
  await mkdir(quickAppDir, { recursive: true })
  return quickAppDir
}

export const removeQuickAppDirs = async (quickAppId: string) => {
  await rm(join(APP_DATA_QUICK_DIR, quickAppId), { recursive: true, force: true })
}

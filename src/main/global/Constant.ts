import { join } from 'node:path'
import { mkdir, rm } from 'node:fs/promises'
import { app } from 'electron'
import s0000 from '../../../resources/migrate/0000.sql?asset'
import { APP_ID } from '@common/global'
import { existsSync } from 'node:fs'

export const APP_DATA_DIR = join(app.getPath('appData'), APP_ID)

export const APP_DATA_ASSET_DIR = join(APP_DATA_DIR, 'asset')
export const APP_DATA_DB_DIR = join(APP_DATA_DIR, 'db')
export const APP_DATA_PLUGIN_DIR = join(APP_DATA_DIR, 'plugins')
export const APP_DATA_PLUGIN_DATA_DIR = join(APP_DATA_DIR, 'plugin_data')
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
    mkdir(APP_DATA_ASSET_DIR, { recursive: true }),
    mkdir(APP_DATA_DB_DIR, { recursive: true }),
    mkdir(APP_DATA_QUICK_DIR, { recursive: true }),
    mkdir(APP_DATA_PLUGIN_DIR, { recursive: true }),
    mkdir(APP_DATA_PLUGIN_DATA_DIR, { recursive: true })
  ])
}

export const appPluginConfigPath = (pluginId: string) =>
  join(APP_DATA_PLUGIN_DIR, pluginId, 'plugin.json')

// 创建一个插件的全部目录
export const createPluginRuntimeDirs = async (pluginId: string) => {
  const runtime = join(APP_DATA_PLUGIN_DIR, pluginId)
  await mkdir(runtime, { recursive: true })
  return runtime
}

const mkdirIfNotExists = async (path: string): Promise<void> => {
  if (existsSync(path)) {
    return Promise.resolve()
  }
  await mkdir(path, { recursive: true })
}
export const getPluginDataDir = (identifier: string) => join(APP_DATA_PLUGIN_DATA_DIR, identifier)
export const createPluginDataDirs = async (identifier: string) => {
  const baseDir = getPluginDataDir(identifier)
  await Promise.all([
    // mkdir(join(baseDir, 'resource')),
    mkdirIfNotExists(join(baseDir, 'config')),
    mkdirIfNotExists(join(baseDir, 'data')),
    mkdirIfNotExists(join(baseDir, 'cache')),
    mkdirIfNotExists(join(baseDir, 'log')),
    mkdirIfNotExists(join(baseDir, 'localData'))
  ])
}

export const removePluginDataDirs = async (identifier: string) => {
  const baseDir = getPluginDataDir(identifier)
  await Promise.all([
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

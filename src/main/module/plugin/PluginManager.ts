import { mkdir, readdir, readFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { app } from 'electron'
import AdmZip from 'adm-zip'
import { PluginEntityWrap, PluginVerifyResult } from '@common/types'
import { pluginVerify } from '$/module/plugin'
import {
  APP_DATA_PLUGIN_DIR,
  appPluginConfigPath,
  createPluginDirs,
  removePluginDirs
} from '$/global/Constant'
import { useSnowflake } from '@common/utils'
import { databaseManager, storeManager } from '$/global/BeanFactory'

/**
 * 插件管理器
 */
export class PluginManager {
  // 全部的插件
  private readonly pluginMap = new Map<string, PluginEntityWrap>()

  // 全部支持的小部件列表

  /**
   * 初始化插件列表
   */
  async initPlugins(): Promise<void> {
    const pluginIds = await readdir(APP_DATA_PLUGIN_DIR)
    const items = await Promise.allSettled(
      pluginIds.map(async (pluginId) => {
        const configPath = appPluginConfigPath(pluginId)
        if (existsSync(configPath)) {
          // 读取文件
          const pluginConfigStr = await readFile(configPath, 'utf-8')
          const pc = JSON.parse(pluginConfigStr)
          const r = pluginVerify(pc)
          if (r) {
            // 验证通过，返回
            return {
              ...pc,
              root: join(APP_DATA_PLUGIN_DIR, pluginId)
            } as PluginEntityWrap
          }
        }
        return null
      })
    )
    for (const item of items) {
      if (item.status === 'fulfilled') {
        if (item.value) {
          this.pluginMap.set(item.value.identifier, item.value)
        }
      }
    }
  }

  /**
   * 根据插件 ID 获取插件实体
   */
  getById(id: string): PluginEntityWrap | undefined {
    return this.pluginMap.get(id)
  }

  list() {
    return Array.from(this.pluginMap.values())
  }

  /**
   * 预安装，解压文件到临时目录，并获取插件配置信息
   * @param path 插件 zip 目录
   */
  async verify(path: string): Promise<PluginVerifyResult> {
    // 解压文件到临时目录
    const tempFolder = join(app.getPath('temp'), `dp-plugin-${Date.now()}`)
    await mkdir(tempFolder)
    try {
      // 1. 解压到临时目录
      const zip = new AdmZip(path)
      zip.extractAllTo(tempFolder, true)

      // 2. 寻找并读取配置文件 (假设叫 plugin.json)
      const configPath = join(tempFolder, 'plugin.json')
      if (!existsSync(configPath)) return Promise.reject(new Error('缺少 plugin.json'))

      const configJsonStr = await readFile(configPath, 'utf-8')
      const configJson = JSON.parse(configJsonStr)

      // 3. TypeBox 校验
      if (!pluginVerify(configJson)) {
        return Promise.reject(new Error('plugin.json 格式校验失败'))
      }

      return {
        config: configJson,
        exists: this.pluginMap.has(configJson.identifier)
      }
    } catch (e) {
      return Promise.reject(e)
    } finally {
      // 删除临时目录
      await rm(tempFolder, { recursive: true, force: true })
    }
  }

  // 安装插件
  async install(path: string): Promise<void> {
    // 1. 创建插件 ID
    const id = useSnowflake().nextId()
    // 创建插件相关目录
    const runtime = await createPluginDirs(id)
    // 解压到运行目录
    const zip = new AdmZip(path)
    zip.extractAllTo(runtime, true)
    try {
      // 2. 寻找并读取配置文件 (假设叫 plugin.json)
      const configPath = join(runtime, 'plugin.json')
      if (!existsSync(configPath)) throw new Error('缺少 plugin.json')

      const configJsonStr = await readFile(configPath, 'utf-8')
      const configJson = JSON.parse(configJsonStr)

      // 3. TypeBox 校验
      if (!pluginVerify(configJson)) throw new Error('plugin.json 格式校验失败')

      // 4. 判断插件是否已经存在了
      if (this.pluginMap.has(configJson.identifier))
        throw new Error('插件 identifier 已存在，无法安装')

      // 没有问题，加入当前插件列表
      this.pluginMap.set(configJson.identifier, {
        ...configJson,
        root: join(APP_DATA_PLUGIN_DIR, id)
      })
    } catch (e) {
      // 发生异常，删除插件目录
      removePluginDirs(id)
      return Promise.reject(e)
    }
  }

  /**
   * 升级
   * @param identifier 插件 ID
   * @param path 插件目录
   */
  async upgrade(identifier: string, path: string) {
    // 1. 获取历史插件
    const plugin = this.pluginMap.get(identifier)
    // 如果不存在，则进行安装
    if (!plugin) return this.install(path)
    // 获取运行时目录
    const runtime = join(plugin.root, 'runtime')
    // 删除旧的运行目录，并创建新的
    await rm(runtime, { recursive: true, force: true })
    await mkdir(runtime)
    // 解压到运行目录
    const zip = new AdmZip(path)
    zip.extractAllTo(runtime, true)
    try {
      // 2. 寻找并读取配置文件 (假设叫 plugin.json)
      const configPath = join(runtime, 'plugin.json')
      if (!existsSync(configPath)) throw new Error('缺少 plugin.json')

      const configJsonStr = await readFile(configPath, 'utf-8')
      const configJson = JSON.parse(configJsonStr)

      // 3. TypeBox 校验
      if (!pluginVerify(configJson)) throw new Error('plugin.json 格式校验失败')

      // 没有问题，更新当前插件列表
      this.pluginMap.set(configJson.identifier, configJson)
    } catch (e) {
      // 发生异常
      return Promise.reject(e)
    }
  }

  async uninstall(identifier: string) {
    // 先关闭占用的资源
    databaseManager.closeAllPlugin(identifier)
    storeManager.closeAllPlugin(identifier)
    // 获取插件
    const plugin = this.pluginMap.get(identifier)
    if (!plugin) return Promise.reject(new Error('插件不存在'))
    await rm(plugin.root, { recursive: true, force: true })
    this.pluginMap.delete(identifier)
  }
}

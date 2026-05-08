import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import AdmZip from 'adm-zip'
import { QuickApp, QuickAppCore } from '@common/types'
import { useSnowflake } from '@common/utils'
import { createQuickAppDirs } from '$/global/Constant'
import { existsSync } from 'node:fs'
import { closeQuickWindow } from '$/module/quick/QuickWindow'
import { desktopManager, lmdbManager } from '$/global/BeanFactory'
import { session } from 'electron'
import { logError, logInfo } from '$/lib/log'
import { LMDB_MAIN_KEY, PARTITION } from '@common/global'

export class QuickManager {
  private readonly map = new Map<string, QuickApp>()

  async init() {
    const list = await lmdbManager.getMainList<QuickApp>(LMDB_MAIN_KEY.QUICK)
    this.map.clear()
    list.forEach((item) => {
      this.map.set(item.id, item)
    })
  }

  list() {
    return Array.from(this.map.values())
  }

  getById(id: string) {
    return this.map.get(id)
  }

  private async handleFile(from: QuickAppCore, data: QuickAppCore) {
    if (from.icon && existsSync(from.icon)) {
      // 存在图标
      const ibn = basename(from.icon)
      await copyFile(from.icon, join(data.root, ibn))
      data.icon = ibn
    }
    // 3. 判断来源
    if (from.from === 'ai') {
      // 这个最简单，把 entry 写入到文件
      const target = join(data.root, 'index.html')
      if (target) await rm(target, { force: true })
      await writeFile(target, from.root, 'utf-8')
      data.entry = 'index.html'
    } else if (from.from === 'html') {
      // 这个也简单，复制过去即可
      const t = join(data.root, 'index.html')
      if (t) await rm(t, { force: true })
      await copyFile(from.root, t)
      data.entry = 'index.html'
    } else if (from.from === 'zip') {
      if (existsSync(data.root)) {
        await rm(data.root, { recursive: true, force: true })
        await mkdir(data.root, { recursive: true })
      }
      // 先解压
      const z = new AdmZip(from.root)
      z.extractAllTo(data.root, true)
    } else {
      return Promise.reject(new Error('创建快应用失败，不支持的来源'))
    }
  }

  async install(form: QuickAppCore) {
    // 创建目录
    const quickAppId = useSnowflake().nextId()
    const root = await createQuickAppDirs(quickAppId)
    const now = Date.now()
    const data: QuickApp = {
      ...form,
      id: quickAppId,
      created_at: now,
      updated_at: now,
      root: root
    }
    try {
      await this.handleFile(form, data)
      // 创建
      this.map.set(data.id, data)
      await lmdbManager.setMainList(LMDB_MAIN_KEY.QUICK, this.list())
    } catch (e) {
      // 删除目录
      await rm(root, { recursive: true, force: true })
      this.map.delete(data.id)
      return Promise.reject(e)
    }
  }

  /**
   * 升级
   * @param id 快应用 ID
   * @param form 快应用信息
   */
  async upgrade(id: string, form: QuickAppCore) {
    // 创建目录
    const old = this.map.get(id)
    if (!old) return Promise.reject(new Error(`快应用 ${id} 不存在`))
    // 删除旧的目录
    const data: QuickApp = {
      ...old,
      ...form,
      icon: form.icon ? form.icon : old.icon,
      updated_at: Date.now()
    }
    try {
      await this.handleFile(form, data)
      // 更新
      this.map.set(id, data)
      await lmdbManager.setMainList(LMDB_MAIN_KEY.QUICK, this.list())
    } catch (e) {
      // 删除目录
      await rm(data.root, { recursive: true, force: true })
      this.map.delete(id)
      return Promise.reject(e)
    }
  }

  /**
   * 卸载
   * @param id 快应用 ID
   */
  async uninstall(id: string) {
    const quickApp = this.map.get(id)
    if (!quickApp) return Promise.reject(new Error(`快应用 ${id} 不存在`))
    // 关闭全部窗口
    closeQuickWindow(id)

    const ses = session.fromPartition(PARTITION.QUICK(id))
    // 3. 清除 HTTP 缓存
    try {
      await ses.clearCache()
      logInfo(`[快应用 ${id}] 缓存已清除`)
    } catch (e) {
      logError(`[快应用 ${id}] 清除缓存失败`, e)
    }

    // 4. 彻底清除所有存储数据
    try {
      await ses.clearStorageData({
        // 不指定 origin，表示清除该 session 下所有源的数据
        storages: [
          'cookies',
          'filesystem',
          'indexdb',
          'localstorage',
          'shadercache',
          'websql',
          'serviceworkers',
          'cachestorage'
        ]
      })
      logInfo(`[快应用 ${id}] 存储数据已清除`)
    } catch (e) {
      logError(`[快应用 ${id}] 清除存储数据失败`, e)
    }

    // 删除数据库记录
    this.map.delete(id)
    await lmdbManager.setMainList(LMDB_MAIN_KEY.QUICK, this.list())
    // 删除数据
    await rm(quickApp.root, { recursive: true, force: true })
    // 删除缓存
    this.map.delete(id)
    // 删除桌面节点
    await desktopManager.removeNodesByQuickId(id)
  }

  async getHtml(id: string): Promise<string> {
    const q = this.map.get(id)
    if (!q) return Promise.reject(new Error(`快应用 ${id} 不存在`))
    const path = join(q.root, q.entry)
    return await readFile(path, 'utf-8')
  }
}

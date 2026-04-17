import { copyFile, rm, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import AdmZip from 'adm-zip'
import { QuickApp, QuickAppCore } from '@common/types'
import { addQuickApp, listQuickApps, removeQuickApp, updateQuickApp } from '$/service'
import { useSnowflake } from '@common/utils'
import { createQuickAppDirs, removeQuickAppDirs } from '$/global/Constant'
import { existsSync } from 'node:fs'

export class QuickManager {
  private readonly map = new Map<string, QuickApp>()

  async init() {
    const list = await listQuickApps()
    this.map.clear()
    list.forEach((item) => {
      this.map.set(item.id, item)
    })
  }

  list() {
    return Array.from(this.map.values())
  }

  private async handleFile(form: QuickAppCore, data: QuickAppCore, root: string) {
    if (form.icon && existsSync(form.icon)) {
      // 存在图标
      const ibn = basename(form.icon)
      await copyFile(form.icon, join(root, ibn))
      data.icon = ibn
    }
    // 3. 判断来源
    if (form.from === 'ai' || form.from === 'html') {
      // 这个最简单，吧 entry 写入到文件
      await writeFile(join(root, 'index.html'), form.entry, 'utf-8')
      data.entry = 'index.html'
    } else if (form.from === 'zip') {
      // 先解压
      const z = new AdmZip(form.root)
      z.extractAllTo(root, true)
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
      await this.handleFile(form, data, root)
      // 创建
      await addQuickApp(data)
    } catch (e) {
      // 删除目录
      await rm(root, { recursive: true, force: true })
      return Promise.reject(e)
    } finally {
      // 重新获取列表
      await this.init()
    }
  }

  /**
   * 升级
   * @param id 快应用 ID
   * @param form 快应用信息
   */
  async upgrade(id: string, form: QuickAppCore) {
    // 创建目录
    // 删除旧的目录
    await removeQuickAppDirs(id)
    const root = await createQuickAppDirs(id)
    const data: QuickAppCore = {
      ...form,
      root: root
    }
    try {
      await this.handleFile(form, data, root)
      // 更新
      await updateQuickApp(id, data)
    } catch (e) {
      // 删除目录
      await rm(root, { recursive: true, force: true })
      return Promise.reject(e)
    } finally {
      // 重新获取列表
      await this.init()
    }
  }

  /**
   * 卸载
   * @param id 快应用 ID
   */
  async uninstall(id: string) {
    const quickApp = this.map.get(id)
    if (!quickApp) return Promise.reject(new Error(`快应用 ${id} 不存在`))
    // 删除数据库记录
    await removeQuickApp(id)
    // 删除数据
    await rm(quickApp.root, { recursive: true, force: true })
    // 删除缓存
    this.map.delete(id)
  }
}

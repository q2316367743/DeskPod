import { pluginDevelopGet, pluginDevelopList } from '$/service/PluginDevelopService'
import { PluginEntityWrap, Result } from '@common/types'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { pluginVerify } from '$/module/plugin'
import { dirname } from 'node:path'

export class DevelopManager {
  // 缓存插件内容
  private readonly map = new Map<string, PluginEntityWrap>()

  list() {
    return pluginDevelopList()
  }
  async getInfo(id: string): Promise<Result<PluginEntityWrap>> {
    const info = await pluginDevelopGet(id)
    if (!info) return Result.error('插件未找到', 2)
    const { path } = info
    if (!existsSync(path)) return Result.error('插件文件不存在', 3)
    const text = await readFile(path, 'utf-8')
    try {
      const json = JSON.parse(text)
      const r = pluginVerify(json)
      if (!r) return Result.error('插件文件格式错误', 4)
      const rs = { ...json, root: dirname(path) }
      this.map.set(info.id, rs)
      return Result.ok(rs)
    } catch (e) {
      return Result.error(`插件文件内容错误: ${e}`, 5)
    }
  }

  refreshInfo(id: string) {
    this.map.delete(id)
    return this.getInfo(id)
  }
}

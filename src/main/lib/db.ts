import { Database, open, RootDatabase } from 'lmdb'
import { APP_DATA_DB_DIR } from '$/global/Constant'

export class LmdbManager {
  private readonly env: RootDatabase<string, string>
  private readonly mainDb: Database<string, string>

  constructor() {
    this.env = open<string, string>({
      path: APP_DATA_DB_DIR,
      mapSize: 2 * 1024 * 1024 * 1024, // 默认 2GB
      maxDbs: 3,
      compression: false, // 禁用压缩以提高性能
      encoding: 'binary' // 使用二进制编码
    })
    // 主要数据库
    this.mainDb = this.env.openDB({
      name: 'main',
      encoding: 'string' // 主数据库使用字符串编码
    })
  }

  async getMainValue<T>(key: string): Promise<T | undefined> {
    const v = this.mainDb.get(key)
    if (v) return JSON.parse(v)
    return undefined
  }

  async setMainValue<T>(key: string, value: T): Promise<void> {
    await this.mainDb.put(key, JSON.stringify(value))
    await this.mainDb.flushed
  }

  async getMainList<T>(key: string): Promise<Array<T>> {
    const res = await this.getMainValue<Array<T>>(key)
    return res || []
  }

  async setMainList<T>(key: string, value: Array<T>): Promise<void> {
    await this.setMainValue<Array<T>>(key, value)
  }

  async pushMainList<T>(key: string, value: T): Promise<void> {
    const list = await this.getMainList<T>(key)
    list.push(value)
    await this.setMainList(key, list)
  }
}

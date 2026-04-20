import sqlite3 from 'better-sqlite3'
import { join } from 'node:path'
import { BaseDirectory, getDirectory } from '$/support/plugin-path'

type DatabaseExecuteResult = [number, number | bigint | string | null]

export class DatabaseManager {
  /**
   * 数据库缓存
   * 插件 ID => 数据库 key => 数据库
   */
  private readonly map = new Map<string, sqlite3.Database>()

  async load(db: string, pluginId: string) {
    const filename = `${db}`.replace('sqlite:', '')
    const key = `${pluginId}-${db}`
    if (this.map.has(key)) return key
    const target = join(getDirectory(pluginId, BaseDirectory.AppData), filename)
    const database = new sqlite3(target)
    this.map.set(key, database)
    return key
  }

  async execute(
    key: string,
    query: string,
    values: Array<unknown>,
    pluginId: string
  ): Promise<DatabaseExecuteResult> {
    let database = this.map.get(key)
    if (!database) {
      await this.load(key, pluginId)
      database = this.map.get(key)
    }

    const statements = `${query.replace(/\$\d+/g, '?')}`
      .split(';')
      .map((e) => e.trim())
      .filter((e) => !!e)
    console.log('开始执行，发现语句：', statements.length)
    if (statements.length > 1) {
      for (const statement of statements) {
        database!.exec(statement)
      }
      return [statements.length, null]
    }
    console.log(`开始执行，语句 ${statements[0]}, 条件: ${values ? JSON.stringify(values) : ''}`)

    const update = database!.prepare(statements[0])
    const info = update.run(...values)
    return [info?.changes || 0, info?.lastInsertRowid || null]
  }

  async select(key: string, query: string, values: Array<unknown>, pluginId:string) {
    let database = this.map.get(key)
    if (!database) {
      await this.load(key, pluginId)
      database = this.map.get(key)
    }
    const update = database!.prepare(query.replace(/\$\d+/g, '?'))
    return update!.all(...values)
  }

  async close(key: string): Promise<void> {
    this.map.get(key)?.close()
    this.map.delete(key)
  }

  closeAllPlugin(pluginId: string) {
    const keys = Array.from(this.map.keys())
    for (const key of keys) {
      if (key.startsWith(`${pluginId}-`)) {
        this.map.get(key)?.close()
        this.map.delete(key)
      }
    }
  }
}

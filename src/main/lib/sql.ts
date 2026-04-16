import sqlite3 from 'better-sqlite3'
import { readFile } from 'node:fs/promises'

import { APP_DATA_DB_PATH, MAIN_MIGRATE_FILES } from '$/global/Constant'
import { logError, logInfo } from '$/lib/log'
import { QueryChain } from '$/util/file/QueryWrapper'
import { generatePlaceholders } from '@common/utils'
import { BaseMapper, type TableLike } from '$/util/file'

type TableName = 'release_project'

export interface QueryResult {
  rowsAffected: number
  lastInsertId?: number
}

export class SqlBase<N extends string> {
  protected db: sqlite3.Database
  private readonly fileName: string

  constructor(fileName: string) {
    this.fileName = fileName
    const path = APP_DATA_DB_PATH(this.fileName)
    logInfo('[sql] db path: ', path)
    this.db = new sqlite3(path)
    logInfo('[sql] db init success', this.db)
  }

  private executionChain: Promise<void> = Promise.resolve()

  /**
   * 串行执行 SQL 命令，确保同一时间只有一个查询在运行
   */
  public async execute(query: string, bindValues: unknown[] = []): Promise<QueryResult> {
    // 封装当前操作为一个函数
    const operation = (): QueryResult => {
      const r = this.db.prepare(query).run(...bindValues)
      return {
        rowsAffected: r.changes,
        lastInsertId: r.lastInsertRowid as number
      }
    }

    // 将操作加入执行链
    const result = this.executionChain.then(() => operation())

    // 更新执行链：下一个操作必须等这个完成
    this.executionChain = result.then(
      () => {}, // 成功时继续
      () => {} // 失败也继续（避免链断裂）
    )

    // 延迟 50 ms
    await new Promise((resolve) => setTimeout(resolve, 50))

    // 返回原始结果（带类型）
    return result
  }

  async select<T>(query: string, bindValues: unknown[] = []): Promise<T> {
    return this.db.prepare(query).all(...bindValues) as T
  }

  query<T extends TableLike>(tableName: N) {
    return new QueryChain<T, N>(tableName, this)
  }

  mapper<T extends TableLike>(tableName: N) {
    return new BaseMapper<T, N>(tableName, this)
  }

}

export class SqlWrapper<N extends string> extends SqlBase<N> {
  private readonly migrateFiles: Array<{ file: string; version: number }>

  constructor(fileName: string, migrateFiles: Array<{ file: string; version: number }>) {
    super(fileName)
    this.migrateFiles = migrateFiles
  }

  private async getLatestVersion() {
    const rows = await this.select<
      Array<{
        version: number
      }>
    >('SELECT COALESCE(MAX(version), -1) AS version FROM schema_version;')
    if (rows) {
      const row = rows[0]
      if (row) {
        const { version } = row
        if (typeof version !== 'undefined' && version !== null) {
          return version as number
        }
      }
    }
    return -1
  }

  async migrate() {
    // 1. 检查 schema_version 表是否存在
    logInfo('[sql] 1. 检查 schema_version 表是否存在')
    const rows = await this.select<
      Array<{
        name: string
      }>
    >("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version';")
    if (!rows || !rows.length) {
      logInfo('[sql] 表不存在，创建 schema_version 表')
      await this.execute(
        'CREATE TABLE schema_version (version int PRIMARY KEY,applied_at DATETIME DEFAULT CURRENT_TIMESTAMP);'
      )
    } else {
      logInfo('[sql] 表已存在，跳过创建')
    }

    // 2. 获取当前版本
    logInfo('[sql] 2. 获取当前版本')
    const current = await this.getLatestVersion()
    logInfo('[sql] 当前版本: ', current)
    const pending = this.migrateFiles
      .filter((m) => m.version > current)
      .sort((a, b) => a.version - b.version)

    for (const { file, version } of pending) {
      const sql = await readFile(file, 'utf-8')
      logInfo('[sql] 开始处理文件：', file, ',版本：', version)
      await this.execute('BEGIN')
      try {
        logInfo('[sql] 执行sql文件')
        await this.execute(sql)
        logInfo('[sql] 插入版本')
        await this.execute(
          `INSERT INTO schema_version(version)
                            VALUES (${generatePlaceholders(1)})`,
          [version]
        )
        logInfo('[sql] 提交事务')
        await this.execute('COMMIT')
        logInfo(`[sql] ✅ migration ${file} applied`)
      } catch (e) {
        await this.execute('ROLLBACK')
        logError(`[sql] ❌ migration ${file} failed`, e)
        throw e
      }
    }
  }
}

const sql = new SqlWrapper<TableName>('main', MAIN_MIGRATE_FILES)

export const useSql = () => sql

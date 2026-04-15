import sqlite3 from 'better-sqlite3'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { defineApi } from '$/types/DefineApi'

/**
 * 数据库缓存
 */
const map = new Map<string, sqlite3.Database>()

async function createDatabase(path: string): Promise<sqlite3.Database> {
  if (!existsSync(path)) {
    await mkdir(dirname(path), { recursive: true })
  }
  return new sqlite3(path)
}

interface LoadArgs {
  db: string
}
interface ExecuteArgs {
  db: string
  query: string
  values: string[]
}
type SelectArgs = ExecuteArgs
type CloseArgs = LoadArgs

export default [
  defineApi<LoadArgs>('plugin:sql|load', async (args) => {
    const { db } = args
    const path = `${db}`.replace('sqlite:', '')
    const database = await createDatabase(path)
    map.set(path, database)
    return path
  }),
  defineApi<ExecuteArgs>('plugin:sql|execute', async (args) => {
    const { db, query, values } = args
    const database = map.get(db)

    const statements = `${query}`
      .split(';')
      .map((e) => e.trim())
      .filter((e) => !!e)
    if (statements.length > 1) {
      for (const statement of statements) {
        database?.exec(statement)
      }
      return [statements.length, null]
    }

    const update = database?.prepare(query)
    const info = update?.run(values)
    return [info?.changes, info?.lastInsertRowid]
  }),
  defineApi<SelectArgs>('plugin:sql|select', async (args) => {
    const { db, query, values } = args
    const database = map.get(db)
    const update = database?.prepare(query)
    return update?.all(values)
  }),
  defineApi<CloseArgs>('plugin:sql|close', async (args) => {
    map.get(args.db)?.close()
    map.delete(args.db)
    return Promise.resolve()
  })
]

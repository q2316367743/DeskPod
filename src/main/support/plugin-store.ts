import { defineApi } from '$/global/DefineApi'
import { BaseDirectory, getDirectory } from '$/support/plugin-path'
import { getBrowserWindowByKey } from '$/module/plugin'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

interface LoadArgs {
  path: string
}
interface SetArgs {
  rid: string
  key: string
  value: unknown
}
interface GetArgs {
  rid: string
  key: string
}

interface EntryArgs {
  rid: string
}

type DeleteArgs = GetArgs
type SaveArgs = EntryArgs

const storeMap = new Map<
  string,
  {
    path: string
    store: Record<string, unknown>
  }
>()

/**
 * 数据存储，比较简单，就是读取 json 文件
 */

export default [
  defineApi<LoadArgs>("'plugin:store|load'", async (args, _o, payload) => {
    const { path } = args
    const target = join(getDirectory(payload.pluginId, BaseDirectory.AppData), path)
    // 尝试读取
    const has = existsSync(target)
    const key = randomUUID()
    if (has) {
      // 读取文件
      try {
        const text = await readFile(target, 'utf-8')
        const store = JSON.parse(text)
        storeMap.set(key, {
          path: target,
          store: store
        })
      } catch (e) {
        console.error(e)
      }
    }
    storeMap.set(key, {
      path: target,
      store: {}
    })
  }),
  defineApi<SetArgs>('plugin:store|set', async (args, _o, payload) => {
    const { rid, key, value } = args
    const s = storeMap.get(rid)
    if (s) {
      s.store[key] = value
      const bw = getBrowserWindowByKey(payload.pluginId, payload.label)
      if (bw) {
        bw.emit('store://change', {
          payload: {
            resourceId: rid,
            key: key,
            value: value,
            exists: true
          }
        })
      }
    }
  }),
  defineApi<GetArgs>('plugin:store|get', async (args) => {
    const { rid, key } = args
    const s = storeMap.get(rid)
    if (s) {
      return s[key]
    }
    return undefined
  }),
  defineApi<SetArgs>('plugin:store|has', async (args) => {
    const { rid, key } = args
    const s = storeMap.get(rid)
    if (s) {
      return key in s
    }
    return false
  }),
  defineApi<EntryArgs>('plugin:store|entries', async (args) => {
    const { rid } = args
    const s = storeMap.get(rid)
    if (s) {
      return Object.entries(s.store)
    }
    return []
  }),
  defineApi<DeleteArgs>('plugin:store|delete', async (args, _o, payload) => {
    const { rid, key } = args
    const s = storeMap.get(rid)
    if (s) {
      delete s.store[key]
      const bw = getBrowserWindowByKey(payload.pluginId, payload.label)
      if (bw) {
        bw.emit('store://change', {
          payload: {
            resourceId: args.rid,
            key: args.key,
            exists: false
          }
        })
      }
      return true
    }
    return false
  }),
  defineApi<SaveArgs>('plugin:store|save', async (args) => {
    const { rid } = args
    const s = storeMap.get(rid)
    if (s) {
      await writeFile(s.path, JSON.stringify(args), 'utf-8')
      return true
    }
    return false
  })
]

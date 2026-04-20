import { defineApi } from '$/global/DefineApi'
import { storeManager } from '$/global/BeanFactory'
import { StoreOptions } from '$/module/plugin'

interface LoadArgs {
  path: string
  options?: StoreOptions
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
type ClearArgs = EntryArgs
type ResetArgs = EntryArgs
type KeysArgs = EntryArgs
type ReloadArgs = { rid: string; ignoreDefaults?: boolean }

/**
 * 数据存储，比较简单，就是读取 json 文件
 */

export default [
  defineApi<LoadArgs>('plugin:store|load', async (args, _o, payload) => {
    const { path, options } = args
    return storeManager.load(path, payload.pluginId, options)
  }),
  defineApi<LoadArgs>('plugin:store|get_store', async (args) => {
    const { path } = args
    return storeManager.getStore(path)
  }),
  defineApi<SetArgs>('plugin:store|set', async (args, _o, payload) => {
    const { rid, key, value } = args
    return storeManager.setValue(rid, key, value, payload)
  }),
  defineApi<GetArgs>('plugin:store|get', async (args) => {
    const { rid, key } = args
    return storeManager.getValue(rid, key)
  }),
  defineApi<SetArgs>('plugin:store|has', async (args) => {
    const { rid, key } = args
    return storeManager.hasKey(rid, key)
  }),
  defineApi<DeleteArgs>('plugin:store|delete', async (args, _o, payload) => {
    const { rid, key } = args
    return storeManager.deleteKey(rid, key, payload)
  }),
  defineApi<ClearArgs>('plugin:store|clear', async (args, _o, payload) => {
    const { rid } = args
    return storeManager.clear(rid, payload)
  }),
  defineApi<ResetArgs>('plugin:store|reset', async (args, _o, payload) => {
    const { rid } = args
    return storeManager.reset(rid, payload)
  }),
  defineApi<KeysArgs>('plugin:store|keys', async (args) => {
    const { rid } = args
    return storeManager.keys(rid)
  }),
  defineApi<KeysArgs>('plugin:store|values', async (args) => {
    const { rid } = args
    return storeManager.values(rid)
  }),
  defineApi<EntryArgs>('plugin:store|entries', async (args) => {
    const { rid } = args
    return storeManager.entries(rid)
  }),
  defineApi<EntryArgs>('plugin:store|length', async (args) => {
    const { rid } = args
    return storeManager.length(rid)
  }),
  defineApi<ReloadArgs>('plugin:store|reload', async (args) => {
    const { rid } = args
    return storeManager.reload(rid, args)
  }),
  defineApi<SaveArgs>('plugin:store|save', async (args) => {
    const { rid } = args
    return storeManager.save(rid)
  }),
  // TODO: 其实不是这里的
  defineApi<SaveArgs>('plugin:resources|close', async (args) => {
    const { rid } = args
    return storeManager.save(rid)
  })
]

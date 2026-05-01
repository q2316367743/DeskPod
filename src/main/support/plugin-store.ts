import { defineApi } from '$/global/DefineApi'
import { storeManager } from '$/global/BeanFactory'
import { checkBasePermission, StoreOptions } from '$/module/plugin'

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
    await checkBasePermission(payload, 'store', 'load')
    const { path, options } = args
    return storeManager.load(path, payload.pluginId, options)
  }),
  defineApi<LoadArgs>('plugin:store|get_store', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'get-store')
    const { path } = args
    return storeManager.getStore(path)
  }),
  defineApi<SetArgs>('plugin:store|set', async (args, _o, payload) => {
    await checkBasePermission(payload, 'store', 'set')
    const { rid, key, value } = args
    return storeManager.setValue(rid, key, value, payload)
  }),
  defineApi<GetArgs>('plugin:store|get', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'get')
    const { rid, key } = args
    return storeManager.getValue(rid, key)
  }),
  defineApi<SetArgs>('plugin:store|has', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'has')
    const { rid, key } = args
    return storeManager.hasKey(rid, key)
  }),
  defineApi<DeleteArgs>('plugin:store|delete', async (args, _o, payload) => {
    await checkBasePermission(payload, 'store', 'delete')
    const { rid, key } = args
    return storeManager.deleteKey(rid, key, payload)
  }),
  defineApi<ClearArgs>('plugin:store|clear', async (args, _o, payload) => {
    await checkBasePermission(payload, 'store', 'clear')
    const { rid } = args
    return storeManager.clear(rid, payload)
  }),
  defineApi<ResetArgs>('plugin:store|reset', async (args, _o, payload) => {
    await checkBasePermission(payload, 'store', 'reset')
    const { rid } = args
    return storeManager.reset(rid, payload)
  }),
  defineApi<KeysArgs>('plugin:store|keys', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'keys')
    const { rid } = args
    return storeManager.keys(rid)
  }),
  defineApi<KeysArgs>('plugin:store|values', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'values')
    const { rid } = args
    return storeManager.values(rid)
  }),
  defineApi<EntryArgs>('plugin:store|entries', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'entries')
    const { rid } = args
    return storeManager.entries(rid)
  }),
  defineApi<EntryArgs>('plugin:store|length', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'length')
    const { rid } = args
    return storeManager.length(rid)
  }),
  defineApi<ReloadArgs>('plugin:store|reload', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'reload')
    const { rid } = args
    return storeManager.reload(rid, args)
  }),
  defineApi<SaveArgs>('plugin:store|save', async (args, _o, p) => {
    await checkBasePermission(p, 'store', 'save')
    const { rid } = args
    return storeManager.save(rid)
  }),
  // TODO: 其实不是这里的
  defineApi<SaveArgs>('plugin:resources|close', async (args, _o, p) => {
    await checkBasePermission(p, 'resources', 'close')
    const { rid } = args
    return storeManager.save(rid)
  })
]

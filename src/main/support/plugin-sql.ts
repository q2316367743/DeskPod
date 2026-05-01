import { defineApi } from '$/global/DefineApi'
import { databaseManager, pluginManager } from '$/global/BeanFactory'

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
  defineApi<LoadArgs>('plugin:sql|load', async (args, _o, payload) => {
    await pluginManager.checkBasePermission(payload, 'sql', 'load')
    const { db } = args
    return databaseManager.load(db, payload.pluginId)
  }),
  defineApi<ExecuteArgs>('plugin:sql|execute', async (args, _o, payload) => {
    await pluginManager.checkBasePermission(payload, 'sql', 'execute')
    const { db, query, values } = args
    return databaseManager.execute(db, query, values, payload.pluginId)
  }),
  defineApi<SelectArgs>('plugin:sql|select', async (args, _o, payload) => {
    await pluginManager.checkBasePermission(payload, 'sql', 'select')
    const { db, query, values } = args
    return databaseManager.select(db, query, values, payload.pluginId)
  }),
  defineApi<CloseArgs>('plugin:sql|close', async (args, _o, payload) => {
    await pluginManager.checkBasePermission(payload, 'sql', 'close')
    return databaseManager.close(args.db)
  })
]

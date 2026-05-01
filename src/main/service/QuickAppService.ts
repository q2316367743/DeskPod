import { useSql } from '$/lib/sql'
import { QuickApp, QuickAppCore } from '@common/types'

export function listQuickApps() {
  return useSql().query<QuickApp>('quick_app').list()
}

export function getQuickApp(id: string) {
  return useSql().query<QuickApp>('quick_app').eq('id', id).get()
}

export function addQuickApp(quickApp: QuickApp) {
  return useSql().mapper<QuickApp>('quick_app').insertSelf(quickApp)
}

export function updateQuickApp(id: string, quickApp: QuickAppCore) {
  return useSql()
    .mapper<QuickApp>('quick_app')
    .updateById(id, {
      ...quickApp,
      updated_at: Date.now()
    })
}

export function removeQuickApp(id: string) {
  return useSql().query<QuickApp>('quick_app').eq('id', id).delete()
}

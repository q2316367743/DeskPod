import { DesktopNode } from '@common/types'
import { BUILTIN_KEY } from '@common/global'

export const builtinList: Array<DesktopNode> = [
  {
    id: 'quick',
    type: 'builtin',
    name: '快应用管理',
    icon: 'quick',
    parentId: null,
    sortIndex: 0,
    desktopId: 'dock',
    row: 0,
    column: 0,
    meta: {
      builtinId: BUILTIN_KEY.QUICK
    }
  },
  {
    id: 'plugin',
    type: 'builtin',
    name: '插件管理',
    icon: 'plugin',
    parentId: null,
    sortIndex: 0,
    desktopId: 'dock',
    row: 0,
    column: 1,
    meta: {
      builtinId: BUILTIN_KEY.PLUGIN
    }
  },
  {
    id: 'setting',
    type: 'builtin',
    name: '设置',
    icon: 'setting',
    parentId: null,
    sortIndex: 0,
    desktopId: 'dock',
    row: 0,
    column: 2,
    meta: {
      builtinId: BUILTIN_KEY.SETTING
    }
  }
]

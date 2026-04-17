import { DesktopNode } from '@common/types'

export const builtinList: Array<DesktopNode> = [
  {
    id: 'plugin',
    type: 'builtin',
    name: '插件管理',
    icon: 'plugin',
    parentId: null,
    sortIndex: 0,
    desktopId: 'dock',
    row: 0,
    column: 0,
    meta: {
      builtinId: 'plugin'
    }
  }
]

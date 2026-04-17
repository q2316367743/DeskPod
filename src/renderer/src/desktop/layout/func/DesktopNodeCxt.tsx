import Cxt from '@imengyu/vue3-context-menu'
import { isDark } from '@/global/Constants'
import { DeleteIcon } from 'tdesign-icons-vue-next'
import { MessageBoxUtil, MessageUtil } from '@/utils'
import { DesktopNode } from '@common/types'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'

export function handleDesktopNodeCxt(e: MouseEvent, node: DesktopNode) {
  e.preventDefault()
  e.stopPropagation()
  Cxt.showContextMenu({
    x: e.x,
    y: e.y,
    theme: isDark.value ? 'mac dark' : 'mac',
    items: [
      {
        label: () => <span class={'label color-red'}>卸载</span>,
        icon: () => <DeleteIcon class={'color-red'} />,
        onClick: () => {
          MessageBoxUtil.confirm('是否确认卸载？', '卸载').then(() => {
            window.desktopAPI
              .deleteNode(node.id)
              .then(() => {
                MessageUtil.success('卸载成功')
                useDesktopNodeStore().init()
              })
              .catch((e) => {
                MessageUtil.error('卸载失败: ', e)
              })
          })
        }
      }
    ]
  })
}

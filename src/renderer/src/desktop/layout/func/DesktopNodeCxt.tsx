import Cxt, { type MenuItem } from '@imengyu/vue3-context-menu'
import { isDark } from '@/global/BeanFactory'
import { DeleteIcon, EditIcon } from 'tdesign-icons-vue-next'
import { MessageBoxUtil, MessageUtil } from '@/utils'
import { DesktopNode } from '@common/types'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import { openUpdateLinkAppDialog } from '@/desktop/add/UpdateLinkDialog'

export function handleDesktopNodeCxt(e: MouseEvent, node: DesktopNode) {
  const items: Array<MenuItem> = []

  if (node.type === 'link') {
    items.push({
      label: '修改',
      icon: () => <EditIcon />,
      onClick: () => {
        openUpdateLinkAppDialog(node)
      }
    })
  }

  items.push({
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
  })
  e.preventDefault()
  e.stopPropagation()
  Cxt.showContextMenu({
    x: e.x,
    y: e.y,
    theme: isDark.value ? 'mac dark' : 'mac',
    items
  })
}

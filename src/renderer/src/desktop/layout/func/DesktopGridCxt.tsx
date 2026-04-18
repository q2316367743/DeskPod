import Cxt from '@imengyu/vue3-context-menu'
import { isDark } from '@/global/Constants'
import { openAddAppDialog } from '@/desktop/add/AddAppDialog'
import { openLinkAppDialog } from '@/desktop/add/AddLinkDialog'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import { AppIcon, LinkIcon } from 'tdesign-icons-vue-next'
import { openPluginAppDialog } from '@/desktop/add/AddPluginDialog'
import { openQuickAppDialog } from '@/desktop/add/AddQuickDialog'
import { openAddWidgetDialog } from '@/desktop/add/AddWidgetDialog'

export function handleDesktopGridCxt(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  Cxt.showContextMenu({
    x: e.x,
    y: e.y,
    theme: isDark.value ? 'mac dark' : 'mac',
    items: [
      {
        label: '添加应用',
        icon: () => <AppIcon />,
        onClick: () => {
          openAddAppDialog()
        }
      },
      {
        label: '添加链接',
        icon: () => <LinkIcon />,
        onClick: () => {
          openLinkAppDialog(useDesktopNodeStore().desktopId)
        }
      },
      {
        label: '添加插件',
        onClick: () => {
          openPluginAppDialog(useDesktopNodeStore().desktopId)
        }
      },
      {
        label: '添加快应用',
        onClick: () => {
          openQuickAppDialog(useDesktopNodeStore().desktopId)
        }
      },
      {
        label: '添加小部件',
        onClick: () => {
          openAddWidgetDialog(useDesktopNodeStore().desktopId)
        }
      }
    ]
  })
}

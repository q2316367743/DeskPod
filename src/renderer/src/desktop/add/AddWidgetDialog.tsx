import { DialogPlugin, TabPanel, Tabs } from 'tdesign-vue-next'
import { DesktopNode, pluginEntityToDesktopNode, quickAppToDesktopNode } from '@common/types'

export function openAddWidgetDialog(desktopId: string) {
  const active = ref(1)

  const quickApps = ref(new Array<DesktopNode>())
  const plugins = ref(new Array<DesktopNode>())

  Promise.allSettled([window.quickAPI.list(), window.pluginAPI.list()]).then(([q, p]) => {
    if (q.status === 'fulfilled') {
      quickApps.value = q.value
        .filter((app) => app.type === 'widget')
        .map((app) => quickAppToDesktopNode(app, desktopId))
    }
    if (p.status === 'fulfilled') {
      plugins.value = p.value.map((plugin) => pluginEntityToDesktopNode(plugin, desktopId))
    }
  })

  const dp = DialogPlugin({
    header: '新增小部件',
    placement: 'center',
    closeOnEscKeydown: false,
    footer: false,
    width: 'clamp(800px, 80vw, 1200px)',
    onConfirm: () => {
      dp.destroy()
    },
    default: () => (
      <div style={{ height: 'calc(100vh - 220px)' }}>
        <Tabs v-model={active.value}>
          <TabPanel label={'内置'} value={1} />
          <TabPanel label={'快应用'} value={2} />
          <TabPanel label={'插件'} value={3} />
        </Tabs>
        <div style={{ height: 'calc(100vh - 276px)', marginTop: '8px' }}>内容</div>
      </div>
    )
  })
}

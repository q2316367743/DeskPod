import { DialogPlugin, TabPanel, Tabs } from 'tdesign-vue-next'
import {
  DesktopNode,
  DesktopNodeType,
  pluginEntityToWidgetNode,
  quickAppToWidgetNode
} from '@common/types'
import { useSnowflake } from '@common/utils'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import { MessageUtil } from '@/utils'
import { InnerWeight } from '../widget'
import './AddWidgetDialog.less'

export function openAddWidgetDialog(desktopId: string, column: number, row: number) {
  const active = ref(1)

  const builtins = ref(new Array<DesktopNode>())
  const quickApps = ref(new Array<DesktopNode>())
  const plugins = ref(new Array<DesktopNode>())

  // 初始化内置小部件列表
  builtins.value = InnerWeight.map((item) => ({
    id: '',
    type: 'widget' as DesktopNodeType,
    name: item.name,
    icon: '',
    parentId: null,
    sortIndex: 0,
    desktopId,
    row: 0,
    column: 0,
    meta: {
      source: 'builtin',
      builtinId: item.id,
      width: item.width,
      height: item.height
    }
  }))

  Promise.allSettled([window.quickAPI.list(), window.pluginAPI.list()]).then(([q, p]) => {
    if (q.status === 'fulfilled') {
      quickApps.value = q.value
        .filter((app) => app.type === 'widget')
        .map((app) => quickAppToWidgetNode(app, desktopId))
    }
    if (p.status === 'fulfilled') {
      plugins.value = p.value.flatMap((plugin) => pluginEntityToWidgetNode(plugin, desktopId))
    }
  })

  const handleChoose = (node: DesktopNode) => {
    window.desktopAPI
      .updateNode({
        ...toRaw(node),
        id: useSnowflake().nextId(),
        column: column,
        row: row,
      })
      .then(() => {
        MessageUtil.success('成功添加小部件')
        useDesktopNodeStore().init()
        dp.destroy()
      })
      .catch((e) => {
        MessageUtil.error('添加失败', e)
      })
  }

  const WidgetCard = (props: { node: DesktopNode }) => {
    const { node } = props
    const width = node.meta?.width ?? 1
    const height = node.meta?.height ?? 1
    const hasIcon = !!node.icon

    return (
      <div
        class="widget-card"
        style={{
          gridColumn: `span ${width}`,
          gridRow: `span ${height}`
        }}
        onClick={() => handleChoose(node)}
      >
        {hasIcon ? (
          <div
            class="widget-preview"
            style={{
              backgroundImage: `url(${node.icon})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ) : (
          <div class="widget-placeholder">
            <span style={{ fontSize: '24px', color: 'var(--td-brand-color)' }}>+</span>
          </div>
        )}
        <div class="widget-name">{node.name}</div>
        <div class="widget-size">
          {width}×{height}
        </div>
      </div>
    )
  }

  const WidgetList = (props: { nodes: DesktopNode[] }) => {
    if (props.nodes.length === 0) {
      return (
        <div
          class="widget-empty"
          style={{ color: 'var(--td-gray-color-7)', textAlign: 'center', padding: '48px' }}
        >
          暂无小部件
        </div>
      )
    }
    return (
      <div class="widget-grid">
        {props.nodes.map((node) => (
          <WidgetCard key={node.meta?.builtinId ?? node.meta?.widgetId ?? node.name} node={node} />
        ))}
      </div>
    )
  }

  const dp = DialogPlugin({
    header: '新增小部件',
    placement: 'center',
    closeOnEscKeydown: false,
    footer: false,
    width: 'clamp(800px, 80vw, 1200px)',
    default: () => (
      <div class="add-widget-dialog" style={{ height: 'calc(100vh - 220px)' }}>
        <Tabs v-model={active.value}>
          <TabPanel label={'内置'} value={1} />
          <TabPanel label={'快应用'} value={2} />
          <TabPanel label={'插件'} value={3} />
        </Tabs>
        <div style={{ height: 'calc(100vh - 276px)', marginTop: '8px', overflow: 'auto' }}>
          {active.value === 1 && <WidgetList nodes={builtins.value} />}
          {active.value === 2 && <WidgetList nodes={quickApps.value} />}
          {active.value === 3 && <WidgetList nodes={plugins.value} />}
        </div>
      </div>
    )
  })
}

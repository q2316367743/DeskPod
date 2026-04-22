<template>
  <div class="folder-node" :style="{ width, height }">
    <div class="folder-layout" draggable="false" @mousedown.stop>
      <div class="folder-header">
        <div class="folder-title">{{ node.name }}</div>
        <t-button size="small" variant="outline" theme="primary" shape="square">
          <template #icon>
            <more-icon />
          </template>
        </t-button>
      </div>
      <div ref="gridStackEl" class="folder-content">
        <div
          v-for="item in items"
          :id="`node-${item.id}`"
          :key="item.id"
          class="grid-stack-item"
          :class="`node-type-${item.type}`"
          :data-node-id="item.id"
          @contextmenu.stop="handleDesktopNodeCxt($event, item)"
        >
          <div class="grid-stack-item-content">
            <WidgetNode v-if="item.type === 'widget'" :node="item" />
            <ItemNode v-else :node="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode, getNodeHeight, getNodeWidth } from '@common/types'
import { CELL_SIZE } from '@common/global'
import { MoreIcon } from 'tdesign-icons-vue-next'
import { GridStack, GridStackWidget } from 'gridstack'
import { useDesktopNodeStore } from '@/store'
import { handleDesktopNodeCxt } from '@/desktop/layout/func/DesktopNodeCxt'
import WidgetNode from '@/desktop/node/WidgetNode.vue'
import ItemNode from '@/desktop/node/ItemNode.vue'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  },
  items: {
    type: Object as PropType<Array<DesktopNode>>,
    required: true
  },
  dockMode: {
    type: Boolean,
    default: false
  }
})

const gridStackEl = ref<HTMLElement>()
let grid: GridStack | undefined = undefined

const width = computed(() => `${(props.node.meta?.width || 1) * CELL_SIZE - 16}px`)
const height = computed(() => `${(props.node.meta?.height || 1) * CELL_SIZE - 16}px`)

const syncGridFromNodes = async () => {
  if (!grid) return
  const targetNodes = props.items
  const targetIds = new Set(targetNodes.map((n) => `node-${n.id}`))

  // 1. Remove nodes that no longer exist
  const currentNodes = grid.engine.nodes
  for (const gsNode of currentNodes) {
    if (!targetIds.has(gsNode.id as string)) {
      grid?.removeWidget(gsNode.el!, false)
    }
  }

  // 2. Update or add nodes
  for (const item of targetNodes) {
    const el = document.getElementById(`node-${item.id}`)
    if (!el) continue

    const gsNode = grid.engine.nodes.find((n) => n.id === `node-${item.id}`)
    const isWidget = item.type === 'widget' || item.type === 'folder'
    const options: Partial<GridStackWidget> = {
      x: item.column,
      y: item.row,
      w: getNodeWidth(item),
      h: getNodeHeight(item),
      noResize: !isWidget,
      noMove: false
    }
    if (isWidget) {
      options.minW = 2
      options.minH = 2
    }

    if (gsNode) {
      grid.update(el, options)
    } else {
      grid.makeWidget(el, options)
    }
  }
}

onMounted(async () => {
  if (!gridStackEl.value) return

  grid = GridStack.init(
    {
      column: props.node.meta?.width || 1,
      row: props.node.meta?.height || 1,
      cellHeight: CELL_SIZE,
      acceptWidgets: true,
      margin: 0,
      float: true,
      animate: false,
      draggable: { handle: '.grid-stack-item-content' },
      removable: false,
      // resizable: { handles: 'se, sw, ne, nw, n, e, s, w' }
      resizable: { handles: 's, e' }
    },
    gridStackEl.value
  )
  grid.on('change', (_event, items) => {
    for (let item of items) {
      const { el, x, y, w, h } = item
      if (!el || x === undefined || y === undefined) continue
      const nodeId = el.dataset['nodeId']
      useDesktopNodeStore().move(String(nodeId), x, y, w, h)
    }
  })
  grid.on('dropped', (_event, _previousNode, newNode) => {
    const { el, x, y } = newNode
    if (!el || x === undefined || y === undefined) return
    const nodeId = el.dataset['nodeId']
    useDesktopNodeStore().drop(String(nodeId), props.node.id, x, y)
  })

  syncGridFromNodes()
})

onBeforeUnmount(() => {
  if (grid) {
    grid.destroy()
    grid = undefined
  }
})

watch(
  [width, height, () => props.items],
  async () => {
    await nextTick()
    await syncGridFromNodes()
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.folder-node {
  padding: 7px;
  border: 1px solid transparent;
  border-radius: var(--td-radius-medium);
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: var(--td-border-level-1-color);
    background: var(--fluent-item-hover);
  }
  .folder-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--fluent-card-bg);
    border: 1px solid var(--fluent-card-border);
    border-radius: var(--fluent-radius-card);
    box-shadow: var(--fluent-card-shadow);
    backdrop-filter: var(--fluent-acrylic-blur);
    overflow: hidden;
    .folder-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid var(--fluent-border-subtle);
      background: var(--fluent-acrylic-bg);
      flex-shrink: 0;
      color: var(--td-text-color-primary);
    }
    .folder-content {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>

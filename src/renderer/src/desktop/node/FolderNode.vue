<template>
  <div class="folder-node" :style="{ width, height }">
    <div ref="gridStackEl" class="folder-content" @contextmenu.stop="handleGridContextmenu">
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
          <ItemNode :node="item" size="79px" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { CELL_SIZE } from '@common/global'
import { handleDesktopNodeCxt } from '@/desktop/layout/func/DesktopNodeCxt'
import ItemNode from '@/desktop/node/ItemNode.vue'
import { handleDesktopGridCxt } from '@/desktop/layout/func/DesktopGridCxt'
import { GridStack, GridStackWidget } from 'gridstack'
import { useDesktopNodeStore } from '@/store'

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

const width = computed(() => `${(props.node.column || 1) * CELL_SIZE}px`)
const height = computed(() => `${(props.node.row || 1) * CELL_SIZE}px`)

const computeColumnRowFromEvent = (e: MouseEvent): { column: number; row: number } => {
  const rect = gridStackEl.value?.getBoundingClientRect()
  if (!rect) return { column: 0, row: 0 }
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const column = Math.floor(x / CELL_SIZE)
  const row = Math.floor(y / CELL_SIZE)
  return { column: Math.max(0, column), row: Math.max(0, row) }
}

const handleGridContextmenu = (e: MouseEvent) => {
  const { column, row } = computeColumnRowFromEvent(e)
  handleDesktopGridCxt(e, column, row, props.node.id)
}

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
    const isWidget = !!item.resizeable
    const options: Partial<GridStackWidget> = {
      x: item.x,
      y: item.y,
      w: item.column,
      h: item.row,
      noResize: !isWidget,
      noMove: false
    }
    if (isWidget) {
      options.minW = item.minCol || 2
      options.minH = item.minRow || 2
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
      column: 2,
      row: 2,
      cellHeight: CELL_SIZE - 1,
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
  grid.on('dropped', (event, _previousNode, newNode) => {
    const { el, x, y } = newNode
    if (!el || x === undefined || y === undefined) return
    const nodeId = el.dataset['nodeId']
    useDesktopNodeStore()
      .drop(String(nodeId), props.node.id, x, y)
      .then((res) => {
        if (!res) {
          event.preventDefault()
          event.stopPropagation()
        }
      })
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
  overflow: hidden;
  .folder-content {
    display: flex;
    flex-direction: column;
    background: var(--fluent-card-bg);
    border: 1px solid var(--fluent-card-border);
    border-radius: var(--fluent-radius-card);
    backdrop-filter: var(--fluent-acrylic-blur);
    height: calc(100% - 12px);
    width: calc(100% - 5px);
    overflow: auto;
  }
}
</style>

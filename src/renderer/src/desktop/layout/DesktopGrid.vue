<template>
  <div ref="gridContainer" class="desktop-grid-container" @contextmenu="handleGridContextmenu">
    <div ref="gridStackEl" class="grid-stack">
      <div
        v-for="item in list"
        :id="`node-${item.id}`"
        :key="item.id"
        class="grid-stack-item"
        :class="`node-type-${item.type}`"
        :data-node-id="item.id"
        @contextmenu.stop="handleDesktopNodeCxt($event, item)"
      >
        <div class="grid-stack-item-content">
          <WidgetNode v-if="item.type === 'widget'" :node="item" />
          <FolderNode
            v-else-if="item.type === 'folder'"
            :node="item"
            :items="folderMap.get(item.id) || []"
          />
          <ItemNode v-else :node="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { GridStack, GridStackWidget } from 'gridstack'
import 'gridstack/dist/gridstack.css'
import 'gridstack/dist/gridstack.min.css'
import { handleDesktopGridCxt } from '@/desktop/layout/func/DesktopGridCxt'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import WidgetNode from '@/desktop/node/WidgetNode.vue'
import FolderNode from '@/desktop/node/FolderNode.vue'
import ItemNode from '@/desktop/node/ItemNode.vue'
import { handleDesktopNodeCxt } from '@/desktop/layout/func/DesktopNodeCxt'

const GRID_CELL_SIZE = 96
const gridContainer = ref<HTMLElement | undefined>(undefined)
const gridStackEl = ref<HTMLElement | undefined>(undefined)
let grid: GridStack | undefined = undefined
const store = useDesktopNodeStore()

const items = computed(() => store.nodes)
const list = computed(() => items.value.filter((item) => item.parentId === '0' || !item.parentId))
const folderMap = computed(() => {
  const l = items.value.filter((item) => item.parentId !== '0' && item.parentId)
  const map = new Map<string, Array<DesktopNode>>()
  for (let desktopNode of l) {
    const t = map.get(desktopNode.parentId!)
    if (t) {
      t.push(desktopNode)
    } else {
      map.set(desktopNode.id, [desktopNode])
    }
  }
  return map
})

const getNodeWidth = (node: DesktopNode): number => {
  if (node.type === 'widget') {
    return node.meta?.width || 1
  }
  return 1
}

const getNodeHeight = (node: DesktopNode): number => {
  if (node.type === 'widget') {
    return node.meta?.height || 1
  }
  return 1
}

const computeColumnRowFromEvent = (e: MouseEvent): { column: number; row: number } => {
  const rect = gridContainer.value?.getBoundingClientRect()
  if (!rect) return { column: 0, row: 0 }
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const column = Math.floor(x / GRID_CELL_SIZE)
  const row = Math.floor(y / GRID_CELL_SIZE)
  return { column: Math.max(0, column), row: Math.max(0, row) }
}

const handleGridContextmenu = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('.grid-stack-item')) {
    return
  }
  const { column, row } = computeColumnRowFromEvent(e)
  handleDesktopGridCxt(e, column, row)
}

const syncGridFromNodes = async () => {
  if (!grid) return

  const targetNodes = list.value
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
    const isWidget = item.type === 'widget'
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
      column: Math.floor((window.innerWidth - 32) / GRID_CELL_SIZE),
      row: Math.floor((window.innerHeight - 66 - 32) / GRID_CELL_SIZE),
      cellHeight: GRID_CELL_SIZE,
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
  grid.on('dragstop', (_event, el) => {
    const nodeId = el.dataset['nodeId']
    const column = el.getAttribute('gs-x')
    const row = el.getAttribute('gs-y')
    useDesktopNodeStore().move(String(nodeId), Number(column), Number(row))
  })
  grid.on('resizestop', (_event, el) => {
    const nodeId = el.dataset['nodeId']
    const width = el.getAttribute('gs-w')
    const height = el.getAttribute('gs-h')
    useDesktopNodeStore().resize(String(nodeId), Number(width), Number(height))
  })

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))

  window.addEventListener('resize', () => {
    if (grid) {
      grid.column(Math.floor((window.innerWidth - 32) / GRID_CELL_SIZE), 'none')
    }
  })
})

onBeforeUnmount(() => {
  if (grid) {
    grid.destroy()
    grid = undefined
  }
})

watch(
  () => [items.value.length, items.value.map((n) => `${n.id}-${n.column}-${n.row}`).join(',')],
  async () => {
    await nextTick()
    syncGridFromNodes()
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.desktop-grid-container {
  padding: 8px;
  width: calc(100vw - 16px);
  height: calc(100vh - 82px);
  overflow: auto;
}

.grid-stack {
  width: 100%;
  min-height: 100%;
}

.grid-stack-item-content {
  width: 100%;
  height: 100%;
}

:deep(.grid-stack-item.grid-stack-item-dragging) {
  opacity: 0.7;
  z-index: 10000;
}
</style>

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
import { debounce } from 'es-toolkit'
import { CELL_SIZE } from '@common/global'

const gridContainer = ref<HTMLElement>()
const gridStackEl = ref<HTMLElement>()
let grid: GridStack | undefined = undefined
const store = useDesktopNodeStore()

const items = computed(() => store.nodes)
const list = computed(() => items.value.filter((item) => item.parentId === null))
const folderMap = computed(() => {
  const l = items.value.filter((item) => item.parentId !== null)
  const map = new Map<string, Array<DesktopNode>>()
  for (let desktopNode of l) {
    const t = map.get(desktopNode.parentId!)
    if (t) {
      t.push(desktopNode)
    } else {
      map.set(desktopNode.parentId!, [desktopNode])
    }
  }
  return map
})

const computeColumnRowFromEvent = (e: MouseEvent): { column: number; row: number } => {
  const rect = gridContainer.value?.getBoundingClientRect()
  if (!rect) return { column: 0, row: 0 }
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const column = Math.floor(x / CELL_SIZE)
  const row = Math.floor(y / CELL_SIZE)
  return { column: Math.max(0, column), row: Math.max(0, row) }
}

const handleGridContextmenu = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('.grid-stack-item')) {
    return
  }
  const { column, row } = computeColumnRowFromEvent(e)
  handleDesktopGridCxt(e, column, row, null)
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
    const allowResize = !!item.resizeable
    const options: Partial<GridStackWidget> = {
      x: item.x,
      y: item.y,
      w: item.column,
      h: item.row,
      noResize: !allowResize,
      noMove: false
    }
    if (allowResize) {
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

const onResize = debounce(() => {
  if (grid) {
    grid.column(Math.floor((window.innerWidth - 56) / CELL_SIZE), 'none')
  }
}, 300)

onMounted(async () => {
  if (!gridStackEl.value) return

  grid = GridStack.init(
    {
      column: Math.floor((window.innerWidth - 56) / CELL_SIZE),
      row: Math.floor((window.innerHeight - 66 - 56) / CELL_SIZE),
      cellHeight: CELL_SIZE,
      margin: 0,
      float: true,
      animate: false,
      draggable: { handle: '.grid-stack-item-content' },
      removable: false,
      // resizable: { handles: 'se, sw, ne, nw, n, e, s, w' }
      resizable: { handles: 's, e' },
      acceptWidgets: true
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
    useDesktopNodeStore().drop(String(nodeId), null, x, y)
  })

  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (grid) {
    grid.destroy()
    grid = undefined
  }
  window.removeEventListener('resize', onResize)
})

watch(
  () => [items.value.length, items.value.map((n) => `${n.id}-${n.column}-${n.row}`).join(',')],
  async () => {
    await nextTick()
    await syncGridFromNodes()
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.desktop-grid-container {
  padding: 32px 8px 8px;
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

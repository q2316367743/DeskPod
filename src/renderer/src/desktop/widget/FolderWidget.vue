<template>
  <div class="folder-widget" :style="{ width, height }">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <!-- 面包屑导航 -->
      <t-breadcrumb class="breadcrumb">
        <t-breadcrumb-item
          v-for="(segment, index) in pathSegments"
          :key="index"
          :class="{ disabled: index === pathSegments.length - 1 }"
          @click="navigateToSegment(index)"
        >
          <div v-if="index === 0" class="flex gap-2px items-center">
            <div>{{ homeText }}</div>
          </div>
          <span v-else>{{ segment }}</span>
        </t-breadcrumb-item>
      </t-breadcrumb>

      <!-- 视图切换 -->
      <div class="view-toggle">
        <t-button
          theme="default"
          variant="text"
          size="small"
          :class="{ active: viewMode === 'icon' }"
          @click="viewMode = 'icon'"
        >
          <app-icon />
        </t-button>
        <t-button
          theme="default"
          variant="text"
          size="small"
          :class="{ active: viewMode === 'table' }"
          @click="viewMode = 'table'"
        >
          <view-list-icon />
        </t-button>
      </div>
    </div>

    <!-- 图标模式 -->
    <div v-if="viewMode === 'icon'" class="icon-view">
      <div
        v-for="item in sortedList"
        :key="item.path"
        class="icon-item"
        @dblclick="handleItemClick(item)"
        @contextmenu.stop
      >
        <div class="icon-item-inner">
          <div class="icon-item-icon">
            <FdIcon :icon="getFileIcon(item)" :alt="item.name" :size="40" />
          </div>
          <div class="icon-item-name" :title="item.name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 表格模式 -->
    <div v-else class="table-view">
      <t-table
        :data="sortedList"
        :columns="columns"
        row-key="path"
        size="small"
        hover
        virtual-scroll
        :max-height="tableHeight"
        @row-dblclick="handleTableDblClick"
      >
        <template #name="{ row }">
          <div class="table-name-cell">
            <FdIcon :icon="getFileIcon(row)" :alt="row.name" :size="20" />
            <span class="table-name">{{ row.name }}</span>
          </div>
        </template>
        <template #size="{ row }">
          {{ formatSize(row.size) }}
        </template>
        <template #mtime="{ row }">
          {{ formatDate(row.mtime) }}
        </template>
      </t-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import { AppIcon, ViewListIcon } from 'tdesign-icons-vue-next'
import { DesktopNode } from '@common/types'
import { FileItemView } from '@common/views'
import { CELL_SIZE } from '@common/global'
import FdIcon from '@/components/wod/FdIcon.vue'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})

function getFileIcon(item: FileItemView): string {
  if (item.isDirectory) return 'directory'
  const e = window.supportAPI.path.extname(item.path)
  if (e.length > 0) {
    return e.substring(1)
  }
  return e
}

const width = computed(() => `${(props.node.meta?.width || 1) * CELL_SIZE - 16}px`)
const height = computed(() => `${(props.node.meta?.height || 1) * CELL_SIZE - 16}px`)
const tableHeight = computed(() => `${(props.node.meta?.height || 1) * CELL_SIZE - 16 - 40}px`)
const homeText = computed(() => window.supportAPI.path.basename(props.node!.meta!.root!))

const list = ref<FileItemView[]>([])
const currentPath = ref('')
const viewMode = ref<'icon' | 'table'>('icon')

// 表格列配置
const columns = computed((): PrimaryTableCol[] => [
  { colKey: 'name', title: '名称', width: 200, fixed: 'left' },
  { colKey: 'size', title: '大小', width: 90 },
  { colKey: 'mtime', title: '修改时间', width: 160 }
])

// 路径分段（面包屑）
const pathSegments = computed(() => {
  if (!currentPath.value) return []
  const subpath = currentPath.value.replace(props.node!.meta!.root!, '')
  return subpath.split(window.supportAPI.path.sep)
})

// 排序：文件夹在前，然后按名称排序
const sortedList = computed(() => {
  return [...list.value].sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1
    if (!a.isDirectory && b.isDirectory) return 1
    return a.name.localeCompare(b.name)
  })
})

// 导航到面包屑的某一段
const navigateToSegment = (index: number) => {
  if (index === 0) {
    // 点击 root，导航到根目录
    loadFolder(props.node!.meta!.root!)
  } else {
    loadFolder(
      window.supportAPI.path.join(
        props.node!.meta!.root!,
        ...pathSegments.value.slice(0, index + 1)
      )
    )
  }
}

// 加载文件夹
const loadFolder = async (path: string) => {
  currentPath.value = path
  try {
    list.value = await window.supportAPI.fs.readdir(path)
  } catch (e) {
    console.error('Failed to read directory:', e)
    list.value = []
  }
}

// 处理图标模式点击
const handleItemClick = (item: FileItemView) => {
  if (item.isDirectory) {
    loadFolder(item.path)
  } else {
    window.supportAPI.shell.openPath(item.path)
  }
}

// 处理表格模式双击
const handleTableDblClick = (context: { row: TableRowData }) => {
  const item = context.row as unknown as FileItemView
  if (item.isDirectory) {
    loadFolder(item.path)
  } else {
    window.supportAPI.shell.openPath(item.path)
  }
}

// 格式化文件大小
const formatSize = (bytes: number): string => {
  if (bytes === 0) return '-'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (date: Date): string => {
  const d = new Date(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

onMounted(async () => {
  const root = props.node.meta?.root
  if (root) {
    await loadFolder(root)
  }
})
</script>

<style scoped lang="less">
.folder-widget {
  display: flex;
  flex-direction: column;
  background: var(--fluent-card-bg);
  border: 1px solid var(--fluent-card-border);
  border-radius: var(--fluent-radius-card);
  box-shadow: var(--fluent-card-shadow);
  backdrop-filter: var(--fluent-acrylic-blur);
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--fluent-border-subtle);
  background: var(--fluent-acrylic-bg);
  flex-shrink: 0;
}

.breadcrumb {
  flex: 1;
  min-width: 0;
  overflow: hidden;

  :deep(.t-breadcrumb-item) {
    font-size: 13px;
    cursor: pointer;
    transition: all var(--fluent-transition-fast);

    &.disabled {
      cursor: default;

      .t-breadcrumb-item__text {
        font-weight: 500;
      }
    }

    &:not(.disabled):hover {
      color: var(--fluent-accent-color);
    }
  }
}

.view-toggle {
  display: flex;
  gap: 2px;
  flex-shrink: 0;

  .t-button {
    padding: 4px 8px;
    border-radius: var(--td-radius-small);

    &.active {
      background: var(--fluent-item-selected);
      color: var(--fluent-accent-color);
    }

    &:hover:not(.active) {
      background: var(--fluent-item-hover);
    }
  }
}

// 图标模式
.icon-view {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 4px;
  align-content: start;
}

.icon-item {
  border-radius: var(--td-radius-medium);
  cursor: pointer;
  transition: background var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-item-hover);
  }
}

.icon-item-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  gap: 4px;
}

.icon-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-item-name {
  font-size: 12px;
  color: var(--td-text-color-primary);
  text-align: center;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 68px;
}

// 表格模式
.table-view {
  flex: 1;
  overflow: hidden;
  padding: 4px 8px;

  :deep(.t-table) {
    background: transparent;
    border: none;
  }

  :deep(.t-table__header) {
    background: transparent;
  }

  :deep(.t-table__row) {
    cursor: pointer;

    &:hover {
      background: var(--fluent-item-hover);
    }
  }
}

.table-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .table-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

<template>
  <div class="folder-widget">
    <!-- 顶部工具栏 -->
    <div class="folder-widget-toolbar">
      <!-- 面包屑导航 -->
      <div>{{ homeText }}</div>

      <!-- 视图切换 -->
      <div class="flex gap-8px">
        <t-button
          theme="primary"
          variant="outline"
          size="small"
          shape="circle"
          @click="handleRefresh"
        >
          <refresh-icon />
        </t-button>
      </div>
    </div>

    <!-- 图标模式 -->
    <div class="icon-view" @mousedown.stop @contextmenu.stop>
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
  </div>
</template>

<script lang="ts" setup>
import { RefreshIcon } from 'tdesign-icons-vue-next'
import { DesktopNode } from '@common/types'
import { FileItemView } from '@common/views'
import FdIcon from '@/components/wod/FdIcon.vue'
import { MessageUtil } from '@/utils'

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

const homeText = computed(() => window.supportAPI.path.basename(props.node!.meta!.root!))

const list = ref<FileItemView[]>([])
const currentPath = ref('')

// 排序：文件夹在前，然后按名称排序
const sortedList = computed(() => {
  return [...list.value].sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1
    if (!a.isDirectory && b.isDirectory) return 1
    return a.name.localeCompare(b.name)
  })
})

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
  window.supportAPI.shell.openPath(item.path)
}

const handleRefresh = async () => {
  const root = props.node.meta?.root
  if (root) {
    await loadFolder(root)
    MessageUtil.success('刷新成功')
  }
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
  overflow: hidden;
  height: 100%;
}

.folder-widget-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--fluent-border-subtle);
  flex-shrink: 0;
  color: var(--td-text-color-primary);
  background: var(--fluent-acrylic-bg);
}

// 图标模式
.icon-view {
  flex: 1;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 4px;
  align-content: start;
  height: calc(100% - 32px);
  overflow: auto;
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
  user-select: none;
}

// 表格模式
</style>

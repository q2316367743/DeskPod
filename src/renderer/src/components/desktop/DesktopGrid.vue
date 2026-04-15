<script lang="ts" setup>
import { DesktopNode } from '@common/types/DesktopNode'
import DesktopIcon from './DesktopIcon.vue'
import DesktopFolder from './DesktopFolder.vue'
import { AddIcon } from 'tdesign-icons-vue-next'

const props = defineProps<{
  items: DesktopNode[]
}>()

const emit = defineEmits<{
  click: [node: DesktopNode]
  contextmenu: [node: DesktopNode, e: MouseEvent]
  addApp: []
  addLink: []
}>()

const DEFAULT_DESKTOP_ID = 'desktop-1'

// 分类：widget 区域和普通图标区域
const widgets = computed(() => props.items.filter((n) => n.type === 'widget'))
const regularItems = computed(() => props.items.filter((n) => n.type !== 'widget'))

// 文件夹项和非文件夹项
const folderItems = computed(() => {
  const folders = new Map<string, DesktopNode[]>()
  const standalone: DesktopNode[] = []

  for (const item of regularItems.value) {
    if (item.parentId) {
      if (!folders.has(item.parentId)) {
        folders.set(item.parentId, [])
      }
      folders.get(item.parentId)!.push(item)
    } else {
      standalone.push(item)
    }
  }

  return { folders, standalone }
})

const handleClick = (node: DesktopNode) => {
  emit('click', node)
}

const handleContextMenu = (node: DesktopNode, e: MouseEvent) => {
  emit('contextmenu', node, e)
}

// 打开应用
const openNode = async (node: DesktopNode) => {
  if (window.desktopAPI) {
    await window.desktopAPI.openApp(node)
  }
}

const onIconClick = async (node: DesktopNode) => {
  emit('click', node)
  await openNode(node)
}

// 添加应用/链接
const handleAddApp = () => {
  emit('addApp')
}

const handleAddLink = () => {
  emit('addLink')
}

// 加载桌面数据
const loadDesktopData = async () => {
  if (window.desktopAPI) {
    try {
      const data = await window.desktopAPI.getTree(DEFAULT_DESKTOP_ID)
      // 如果父组件没有传 items，使用 IPC 获取的数据
      if (props.items.length === 0) {
        // 这里可以通过事件通知父组件
      }
    } catch (error) {
      console.error('Failed to load desktop data:', error)
    }
  }
}

onMounted(() => {
  loadDesktopData()
})
</script>

<template>
  <div class="desktop-grid-container">
    <!-- Widget 区域 -->
    <div v-if="widgets.length > 0" class="widget-area">
      <div
        v-for="widget in widgets"
        :key="widget.id"
        class="widget-slot"
        :style="{
          gridColumn: `span ${widget.meta?.width || 2}`,
          gridRow: `span ${widget.meta?.height || 1}`
        }"
      >
        <!-- Widget 占位，后续可扩展 -->
        <div class="widget-placeholder">
          <span>{{ widget.name }}</span>
        </div>
      </div>
    </div>

    <!-- 普通图标网格 -->
    <div class="icon-grid">
      <!-- 独立图标 -->
      <template v-for="item in folderItems.standalone" :key="item.id">
        <DesktopIcon
          v-if="item.type !== 'folder'"
          :node="item"
          @click="onIconClick"
          @contextmenu="handleContextMenu"
        />
        <DesktopFolder
          v-else
          :items="folderItems.folders.get(item.id) || [item]"
          @click="handleClick"
          @contextmenu="handleContextMenu"
        />
      </template>

      <!-- 文件夹 -->
      <template v-for="[folderId, children] in folderItems.folders" :key="folderId">
        <DesktopFolder :items="children" @click="handleClick" @contextmenu="handleContextMenu" />
      </template>

      <!-- 添加按钮 -->
      <div class="add-section">
        <div class="add-btn" @click="handleAddApp">
          <div class="add-icon-wrapper">
            <AddIcon size="24px" />
          </div>
          <span class="add-label">添加应用</span>
        </div>
        <div class="add-btn" @click="handleAddLink">
          <div class="add-icon-wrapper link">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span class="add-label">添加链接</span>
        </div>
      </div>
    </div>

    <!-- 置灰的功能区域 -->
    <div class="disabled-section">
      <div class="disabled-btn" title="即将上线">
        <div class="disabled-icon-wrapper">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <span class="disabled-label">小组件</span>
      </div>
      <div class="disabled-btn" title="即将上线">
        <div class="disabled-icon-wrapper">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
          </svg>
        </div>
        <span class="disabled-label">设置</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.desktop-grid-container {
  padding: 16px 24px 24px;
}

.widget-area {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.widget-slot {
  background: var(--fluent-acrylic-bg);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-large);
  min-height: 100px;
}

.widget-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--td-text-color-placeholder);
  font-size: 14px;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}

.add-section {
  display: flex;
  gap: 8px;
}

.add-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  padding: 8px;
  border-radius: var(--fluent-radius-card);
  cursor: pointer;
  transition: all var(--fluent-transition-fast);
  border: 1px dashed var(--fluent-border-subtle);

  &:hover {
    background: var(--fluent-item-hover);
    border-color: var(--fluent-accent-color);
  }

  &:active {
    transform: scale(0.95);
  }
}

.add-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--fluent-radius-smooth);
  background: var(--fluent-accent-light);
  color: var(--fluent-accent-color);
  margin-bottom: 6px;

  &.link {
    background: var(--td-success-color-1);
    color: var(--td-success-color-5);
  }
}

.add-label {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.disabled-section {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--fluent-border-subtle);
}

.disabled-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  padding: 8px;
  border-radius: var(--fluent-radius-card);
  opacity: 0.4;
  cursor: not-allowed;
}

.disabled-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--fluent-radius-smooth);
  background: var(--td-gray-color-3);
  color: var(--td-gray-color-7);
  margin-bottom: 6px;
}

.disabled-label {
  font-size: 12px;
  color: var(--td-text-color-disabled);
}
</style>

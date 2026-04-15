<template>
  <div class="desktop-grid-container">
    <!-- 普通图标网格 -->
    <div class="icon-grid">
      <!-- 独立图标 -->
      <template v-for="item in list" :key="item.id">
        <WidgetNode v-if="item.type === 'widget'" :node="item" />
        <FolderNode
          v-else-if="item.type === 'folder'"
          :node="item"
          :items="folderMap.get(item.id) || []"
        />
        <ItemNode v-else :node="item" />
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
  </div>
</template>

<script lang="ts" setup>
import { DesktopNode } from '@common/types/DesktopNode'
import { AddIcon } from 'tdesign-icons-vue-next'
import WidgetNode from '@/desktop/node/WidgetNode.vue'
import FolderNode from '@/desktop/node/FolderNode.vue'
import ItemNode from '@/desktop/node/ItemNode.vue'

const props = defineProps<{
  items: DesktopNode[]
}>()

const emit = defineEmits<{
  addApp: []
  addLink: []
}>()

const list = computed(() => props.items.filter((item) => item.parentId === '0' || !item.parentId))
const folderMap = computed(() => {
  const l = props.items.filter((item) => item.parentId !== '0' && item.parentId)
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

// 添加应用/链接
const handleAddApp = () => {
  emit('addApp')
}

const handleAddLink = () => {
  emit('addLink')
}
</script>

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

.disabled-label {
  font-size: 12px;
  color: var(--td-text-color-disabled);
}
</style>

<template>
  <div class="desktop-grid-container" @contextmenu="handleDesktopGridCxt($event)">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DesktopNode } from '@common/types/DesktopNode'
import { handleDesktopGridCxt } from '@/desktop/layout/func/DesktopGridCxt'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import WidgetNode from '@/desktop/node/WidgetNode.vue'
import FolderNode from '@/desktop/node/FolderNode.vue'
import ItemNode from '@/desktop/node/ItemNode.vue'

const items = computed(() => useDesktopNodeStore().nodes)
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
</script>

<style lang="less" scoped>
.desktop-grid-container {
  padding: 16px;
  width: calc(100vw - 32px);
  height: calc(100vh - 98px);
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

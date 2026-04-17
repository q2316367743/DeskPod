<template>
  <div class="folder-node">
    <div class="folder-header" @click="handleFolderClick">
      <FolderIcon size="24px" class="folder-icon" />
      <span class="folder-name">{{ items[0]?.name || '文件夹' }}</span>
      <ArrowRightIcon size="16px" :class="['expand-icon', { expanded: isExpanded }]" />
    </div>

    <transition name="folder-expand">
      <div v-if="isExpanded" class="folder-children">
        <ItemNode v-for="item in items" :key="item.id" :node="item" />
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { ArrowRightIcon, FolderIcon } from 'tdesign-icons-vue-next'
import ItemNode from '@/desktop/node/ItemNode.vue'

defineProps({
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

const isExpanded = ref(false)

const toggleExpand = (e: MouseEvent) => {
  e.stopPropagation()
  isExpanded.value = !isExpanded.value
}

const handleFolderClick = (e: MouseEvent) => {
  e.stopPropagation()
  toggleExpand(e)
}
</script>

<style lang="less" scoped>
.folder-node {
  display: flex;
  flex-direction: column;
  width: 80px;
  padding: 8px;
}

.folder-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: var(--fluent-radius-card);
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-item-hover);
  }

  &:active {
    background: var(--fluent-item-active);
  }
}

.folder-icon {
  color: var(--fluent-accent-color);
  margin-bottom: 4px;
}

.folder-name {
  font-size: 12px;
  color: var(--td-text-color-primary);
  text-align: center;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 72px;
}

.expand-icon {
  color: var(--td-text-color-placeholder);
  transition: transform var(--fluent-transition-fast);
  margin-top: 2px;

  &.expanded {
    transform: rotate(90deg);
  }
}

.folder-children {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  margin-top: 4px;
  background: var(--fluent-acrylic-bg);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-card);
  box-shadow: var(--fluent-elevation-1);
}

.folder-expand-enter-active,
.folder-expand-leave-active {
  transition: all var(--fluent-transition-normal);
}

.folder-expand-enter-from,
.folder-expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

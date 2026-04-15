<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { DesktopNode } from '@common/types/DesktopNode'
import { FolderIcon, ArrowRightIcon } from 'tdesign-icons-vue-next'

const props = defineProps<{
  items: DesktopNode[]
  expanded?: boolean
}>()

const emit = defineEmits<{
  click: [node: DesktopNode]
  contextmenu: [node: DesktopNode, e: MouseEvent]
}>()

const isExpanded = ref(props.expanded ?? false)

const toggleExpand = (e: MouseEvent) => {
  e.stopPropagation()
  isExpanded.value = !isExpanded.value
}

const handleFolderClick = (e: MouseEvent) => {
  e.stopPropagation()
  toggleExpand(e)
}

// 过滤出文件夹和非文件夹
const folders = computed(() => props.items.filter((n) => n.type === 'folder'))
const nonFolders = computed(() => props.items.filter((n) => n.type !== 'folder'))

const handleItemClick = (node: DesktopNode) => {
  if (node.type === 'folder') {
    // 展开文件夹
    isExpanded.value = true
  } else {
    emit('click', node)
  }
}

watch(
  () => props.expanded,
  (val) => {
    if (val !== undefined) {
      isExpanded.value = val
    }
  }
)
</script>

<template>
  <div class="folder-node">
    <div class="folder-header" @click="handleFolderClick">
      <FolderIcon size="24px" class="folder-icon" />
      <span class="folder-name">{{ items[0]?.name || '文件夹' }}</span>
      <ArrowRightIcon size="16px" :class="['expand-icon', { expanded: isExpanded }]" />
    </div>

    <transition name="folder-expand">
      <div v-if="isExpanded" class="folder-children">
        <template v-for="item in items" :key="item.id">
          <DesktopIcon
            v-if="item.type !== 'folder'"
            :node="item"
            @click="handleItemClick"
            @contextmenu="emit('contextmenu', item, $event)"
          />
        </template>
      </div>
    </transition>
  </div>
</template>

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

<template>
  <div
    class="desktop-icon"
    :title="node.name"
    @click="handleClick(node)"
  >
    <div class="icon-wrapper">
      <img
        v-if="node.icon"
        :src="node.icon"
        :alt="node.name"
        class="icon-image"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <div v-else class="icon-placeholder">
        <span class="icon-letter">{{ node.name.charAt(0).toUpperCase() }}</span>
      </div>
    </div>
    <span class="icon-name">{{ node.name }}</span>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  },
  dockMode: {
    type: Boolean,
    default: false
  }
})

const nodeSize = computed(() => (props.dockMode ? '52px' : '48px'))

const getNodeIcon = (node: DesktopNode) => {
  if (node.icon) {
    // 如果是图片路径
    if (node.icon.startsWith('/') || node.icon.startsWith('C:') || node.icon.startsWith('http')) {
      return node.icon
    }
    // 内置图标标识
    return ''
  }
  // 默认图标
  return ''
}

const handleClick = (node: DesktopNode) => {
  window.desktopAPI.openApp(toRaw(node))
}
</script>
<style scoped lang="less">
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  padding: 8px;
  border-radius: var(--fluent-radius-card);
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-item-hover);
  }

  &:active {
    background: var(--fluent-item-active);
    transform: scale(0.95);
  }
}

.icon-wrapper {
  width: v-bind(nodeSize);
  height: v-bind(nodeSize);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.icon-image {
  width: v-bind(nodeSize);
  height: v-bind(nodeSize);
  border-radius: var(--fluent-radius-smooth);
  object-fit: cover;
}

.icon-placeholder {
  width: v-bind(nodeSize);
  height: v-bind(nodeSize);
  border-radius: var(--fluent-radius-smooth);
  background: var(--fluent-gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--fluent-card-shadow);
}

.icon-letter {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.icon-name {
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
</style>

<template>
  <div
    :class="{ 'desktop-icon': true, dock: dockMode }"
    :title="node.name"
    @dblclick="handleClick(node)"
  >
    <div :class="['icon-wrapper', node.type]">
      <item-icon :icon="node.icon" :name="node.name" />
    </div>
    <span v-if="!dockMode" :class="['icon-name', node.type]">{{ node.name }}</span>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import ItemIcon from '@/desktop/icon/ItemIcon.vue'

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
  padding: 4px;
  margin: 4px;
  border-radius: var(--fluent-radius-card);
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &.dock {
    width: 48px;
    height: 48px;
    padding: 0;
    .icon-wrapper {
      margin-bottom: 0;
    }
    &:hover {
      background: transparent;
    }
  }

  &:hover {
    background: var(--fluent-item-hover);
    .icon-name {
      &.link {
        color: var(--td-text-color-link);
        text-decoration: underline;
      }
    }
  }

  &:active {
    background: var(--fluent-item-active);
    transform: scale(0.95);
  }

  :deep(.t-image__wrapper) {
    background-color: transparent !important;
  }
}

.icon-wrapper {
  width: v-bind(nodeSize);
  height: v-bind(nodeSize);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  position: relative;
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
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 72px;
  transition: all 0.3s ease-in-out;
}
</style>

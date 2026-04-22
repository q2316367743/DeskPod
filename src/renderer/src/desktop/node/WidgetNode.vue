<template>
  <div class="widget-node" :style="{ width, height }">
    <builtin-widget-node v-if="node.meta?.source === 'builtin'" :node="node" />
    <plugin-widget-node v-if="node.meta?.source === 'plugin'" :node="node" />
    <quick-widget-node v-else-if="node.meta?.source === 'quick'" :node="node" />
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { CELL_SIZE } from '@common/global'
import PluginWidgetNode from '@/desktop/node/PluginWidgetNode.vue'
import QuickWidgetNode from '@/desktop/node/QuickWidgetNode.vue'
import BuiltinWidgetNode from '@/desktop/node/BuiltinWidgetNode.vue'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
const width = computed(() => `${(props.node.meta?.width || 1) * CELL_SIZE - 16}px`)
const height = computed(() => `${(props.node.meta?.height || 1) * CELL_SIZE - 16}px`)
</script>
<style scoped lang="less">
.widget-node {
  padding: 7px;
  border: 1px solid transparent;
  border-radius: var(--td-radius-medium);
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: var(--td-border-level-1-color);
    background: var(--fluent-item-hover);
  }

  .widget-node-content {
    border-radius: 8px;
  }
}
</style>

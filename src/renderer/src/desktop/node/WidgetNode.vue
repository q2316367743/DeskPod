<template>
  <div class="widget-node" :style="{ width, height }" :class="{ 'widget-node': true }">
    <div class="h-full w-full">
      <builtin-widget-node v-if="node.meta?.source === 'builtin'" :node="node" />
      <plugin-widget-node v-if="node.meta?.source === 'plugin'" :node="node" />
      <quick-widget-node v-else-if="node.meta?.source === 'quick'" :node="node" />
    </div>
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
const width = computed(() => `${(props.node.column || 1) * CELL_SIZE}px`)
const height = computed(() => `${(props.node.row || 1) * CELL_SIZE - 8}px`)
</script>
<style scoped lang="less">
.widget-node {
  display: flex;
  flex-direction: column;
  background: var(--fluent-card-bg);
  border-radius: var(--td-radius-medium);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid transparent;
  overflow: hidden;
}
</style>

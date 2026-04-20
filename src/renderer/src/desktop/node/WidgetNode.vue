<template>
  <div class="widget-node" :style="{ width, height }">
    <plugin-widget-node v-if="node.meta?.source === 'plugin'" :node="node" />
    <quick-widget-node v-else-if="node.meta?.source === 'quick'" :node="node" />
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { CELL_SIZE } from '@common/global'
import PluginWidgetNode from '@/desktop/node/PluginWidgetNode.vue'
import QuickWidgetNode from '@/desktop/node/QuickWidgetNode.vue'

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
  padding: 8px;
  .widget-node-content {
    border-radius: 8px;
  }
}
</style>

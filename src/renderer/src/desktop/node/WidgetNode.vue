<template>
  <div
    class="widget-node"
    :style="{ width, height }"
    :class="{ 'widget-node': true, 'hide-header': node.meta?.hiddenHeader }"
  >
    <div v-if="!node.meta?.hiddenHeader" class="widget-node-header">
      <div class="folder-title">{{ node.name }}</div>
      <t-dropdown trigger="click" placement="bottom-right">
        <t-button size="small" variant="outline" theme="primary" shape="square">
          <template #icon>
            <more-icon />
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item>
            <template #prefix-icon>
              <edit-icon />
            </template>
            重命名
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </div>
    <div class="widget-node-content" :style="contentStyle">
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
import { EditIcon, MoreIcon } from 'tdesign-icons-vue-next'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
const width = computed(() => `${(props.node.column || 1) * CELL_SIZE}px`)
const height = computed(() => `${(props.node.row || 1) * CELL_SIZE - 8}px`)
const contentStyle = computed(() => ({
  borderRadius: props.node.meta.hiddenHeader ? '8px' : '0',
  height: `${(props.node.row || 1) * CELL_SIZE - (props.node.meta.hiddenHeader ? 8 : 43)}px`,
  overflow: 'hidden'
}))
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

  &.hide-header {
    background-color: transparent;
    transition: all 0.3s ease-in-out;
    backdrop-filter: unset;

    &:hover {
      border: 1px solid var(--td-border-level-1-color);
      backdrop-filter: var(--fluent-acrylic-blur);
    }
  }
  .widget-node-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--fluent-border-subtle);
    background: var(--fluent-acrylic-bg);
    flex-shrink: 0;
    color: var(--td-text-color-primary);
  }

  .widget-node-content {
  }
}
</style>

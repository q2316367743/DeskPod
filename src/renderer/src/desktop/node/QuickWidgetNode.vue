<template>
  <div class="quick-widget-node">
    <webview class="w-full h-full" :src="node.meta?.root" :web-security="false"></webview>
    <div class="hand">
      <move-icon />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { MoveIcon } from 'tdesign-icons-vue-next'

defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
</script>
<style scoped lang="less">
.quick-widget-node {
  width: 100%;
  height: 100%;
  position: relative;
  .hand {
    position: absolute;
    top: -32px;
    left: 0;
    padding: 4px 8px;
    color: var(--td-text-color-primary);
    border-right: 1px solid var(--td-border-level-1-color);
    border-bottom: 1px solid var(--td-border-level-1-color);
    border-bottom-right-radius: var(--td-radius-medium);
    transition: all 0.3s ease-in-out;
    cursor: move;
  }
  &:hover {
    .hand {
      top: 0;
    }
  }
}
</style>

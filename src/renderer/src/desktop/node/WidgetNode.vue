<template>
  <div class="widget-node" :style="{ width, height }">
    <webview
      class="widget-node-content"
      :style="{ width, height }"
      :src="node.meta?.root"
      :preload="node.meta?.source === 'plugin' ? preload : undefined"
    ></webview>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
const width = computed(() => `${(props.node.meta?.width || 1) * 96 - 16}px`)
const height = computed(() => `${(props.node.meta?.height || 1) * 96 - 16}px`)
const preload = window.pluginAPI.preload()
</script>
<style scoped lang="less">
.widget-node {
  padding: 8px;
  .widget-node-content {
    border-radius: 8px;
  }
}
</style>

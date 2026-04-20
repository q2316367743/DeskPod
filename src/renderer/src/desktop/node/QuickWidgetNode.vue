<template>
  <div class="quick-widget-node" :style="{ width, height }">
    <webview
      class="widget-node-content"
      :style="{ width, height }"
      :src="node.meta?.root"
      :web-security="false"
    ></webview>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { CELL_SIZE } from '@common/global'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
const width = computed(() => `${(props.node.meta?.width || 1) * CELL_SIZE - 16}px`)
const height = computed(() => `${(props.node.meta?.height || 1) * CELL_SIZE - 16}px`)
</script>
<style scoped lang="less"></style>

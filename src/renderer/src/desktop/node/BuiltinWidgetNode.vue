<template>
  <div class="builtin-widget-node" @mousedown.stop>
    <FolderWidget v-if="node.meta?.builtinId === 'folder'" :node="node" />
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import FolderWidget from '@/desktop/widget/FolderWidget.vue'

defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
</script>
<style scoped lang="less"></style>

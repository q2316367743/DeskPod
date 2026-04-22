<template>
  <div class="item-icon">
    <fd-icon v-if="node.icon.startsWith('icon:')" :alt="node.name" :icon="node.icon" />
    <div v-else class="icon-placeholder">
      <span class="icon-letter">{{ node.name.charAt(0).toUpperCase() }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
</script>
<style scoped lang="less">
.item-icon {
  height: 48px;
  width: 48px;
  border-radius: var(--td-radius-medium);
  overflow: hidden;
}
</style>

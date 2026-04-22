<template>
  <div class="item-icon">
    <fd-icon v-if="node.icon.startsWith('icon:')" :alt="node.name" :icon="node.icon.substring(5)" />
    <t-image v-else-if="node.icon.startsWith('file:')" :src="node.icon" class="w-48px h-48px">
      <template #error>
        <t-avatar shape="round" size="48px">{{ node.name.charAt(0).toUpperCase() }}</t-avatar>
      </template>
    </t-image>
    <t-image v-else-if="node.icon.startsWith('http')" :src="node.icon" class="w-48px h-48px">
      <template #error>
        <t-avatar shape="round" size="48px">{{ node.name.charAt(0).toUpperCase() }}</t-avatar>
      </template>
    </t-image>
    <t-avatar v-else shape="round" size="48px">{{ node.name.charAt(0).toUpperCase() }}</t-avatar>
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

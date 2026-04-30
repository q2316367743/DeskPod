<template>
  <div class="item-icon" :style="{ width: `${size}px`, height: `${size}px` }">
    <fd-icon v-if="icon.startsWith('icon:')" :alt="name" :icon="icon.substring(5)" />
    <t-image
      v-else-if="icon.startsWith('file:')"
      :src="icon"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <template #error>
        <t-avatar shape="round" size="32px">{{ name.charAt(0).toUpperCase() }}</t-avatar>
      </template>
    </t-image>
    <t-image
      v-else-if="icon.startsWith('http')"
      :src="icon"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <template #error>
        <t-avatar shape="round" size="32px">{{ name.charAt(0).toUpperCase() }}</t-avatar>
      </template>
    </t-image>
    <t-avatar v-else shape="round" size="32px">{{ name.charAt(0).toUpperCase() }}</t-avatar>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 48
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
:deep(.t-image__wrapper) {
  background: transparent;
}
</style>

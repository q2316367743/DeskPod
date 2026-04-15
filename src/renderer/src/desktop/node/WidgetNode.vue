<template>
  <div>小组件</div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types/DesktopNode'

defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
</script>
<style scoped lang="less"></style>

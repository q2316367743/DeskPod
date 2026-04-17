<template>
  <t-avatar v-if="app.icon" :image="`file://${app.root}/${app.icon}`" />
  <t-avatar v-else>
    {{ app.name.charAt(0).toUpperCase() }}
  </t-avatar>
</template>
<script lang="ts" setup>
import { QuickAppCore } from '@common/types'

defineProps({
  app: {
    type: Object as PropType<QuickAppCore>,
    required: true
  }
})
</script>
<style scoped lang="less"></style>

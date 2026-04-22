<template>
  <t-avatar v-if="plugin.icon" :image="`file://${plugin.root}/runtime/${plugin.icon}`">
    {{ plugin.productName.charAt(0).toUpperCase() }}
  </t-avatar>
  <t-avatar v-else>
    {{ plugin.productName.charAt(0).toUpperCase() }}
  </t-avatar>
</template>
<script lang="ts" setup>
import { PluginEntityWrap } from '@common/types'

defineProps({
  plugin: {
    type: Object as PropType<PluginEntityWrap>,
    required: true
  }
})
</script>
<style scoped lang="less"></style>

<template>
  <t-avatar v-if="plugin.icon" :image="icon">
    {{ plugin.productName.charAt(0).toUpperCase() }}
  </t-avatar>
  <t-avatar v-else>
    {{ plugin.productName.charAt(0).toUpperCase() }}
  </t-avatar>
</template>
<script lang="ts" setup>
import { PluginEntityWrap } from '@common/types'

const props = defineProps({
  plugin: {
    type: Object as PropType<PluginEntityWrap>,
    required: true
  }
})
const icon = computed(() => {
  return window.supportAPI.url.pathToHref(
    window.supportAPI.path.join(props.plugin.root, props.plugin.icon)
  )
})
</script>
<style scoped lang="less"></style>

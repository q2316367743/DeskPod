<template>
  <div class="plugin-widget-node" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { DesktopNode, ViewOptions } from '@common/types'
import { CELL_SIZE } from '@common/global'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})

const PADDING = 16

const widthNum = computed(() => (props.node.meta?.width || 1) * CELL_SIZE - PADDING)
const width = computed(() => `${widthNum.value}px`)
const heightNum = computed(() => (props.node.meta?.height || 1) * CELL_SIZE - PADDING)
const height = computed(() => `${heightNum.value}px`)

function getViewOptions(): ViewOptions {
  return {
    x: props.node.column * (CELL_SIZE + 6),
    y: props.node.row * CELL_SIZE + 40,
    width: widthNum.value,
    height: heightNum.value
  }
}

function getViewKey(): { pluginId: string; label: string } {
  const pluginId = props.node.meta?.pluginId || ''
  const label = props.node.name
  return { pluginId, label }
}

onMounted(async () => {
  const { pluginId, label } = getViewKey()
  if (!pluginId) return
  try {
    await window.desktopAPI.widgetCreate(pluginId, label, getViewOptions())
  } catch (e) {
    console.error('Failed to create widget view:', e)
  }
})

onBeforeUnmount(async () => {
  const { pluginId, label } = getViewKey()
  if (!pluginId) return
  try {
    await window.desktopAPI.widgetDelete(pluginId, label)
  } catch (e) {
    console.error('Failed to delete widget view:', e)
  }
})

watch(
  () => [props.node.column, props.node.row, widthNum.value, width.value],
  async () => {
    const { pluginId, label } = getViewKey()
    if (!pluginId) return
    try {
      await window.desktopAPI.widgetMove(pluginId, label, getViewOptions())
    } catch (e) {
      console.error('Failed to move widget view:', e)
    }
  }
)
</script>
<style scoped lang="less"></style>

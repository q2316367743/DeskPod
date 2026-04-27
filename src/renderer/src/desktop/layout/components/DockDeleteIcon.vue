<template>
  <t-tooltip content="回收站">
    <div ref="trashRef" class="disabled-btn">
      <div class="disabled-icon-wrapper">
        <delete-icon size="24px" />
      </div>
    </div>
  </t-tooltip>
</template>
<script lang="ts" setup>
import { DeleteIcon } from 'tdesign-icons-vue-next'
import { GridStack } from 'gridstack'
import { MessageUtil } from '@/utils'

// 回收站
let grid: GridStack | null = null
const trashRef = ref()

onMounted(() => {
  if (!trashRef.value) return

  grid = GridStack.init(
    {
      column: 1,
      row: 1,
      cellHeight: 48,
      acceptWidgets: true
    },
    trashRef.value
  )
  grid.on('dropped', (_event, _previousNode, newNode) => {
    const { el } = newNode
    if (!el) return
    const nodeId = el.dataset['nodeId'] as string
    // 删除
    window.desktopAPI.deleteNode(nodeId)
    const currentNodes = grid?.engine.nodes || []
    for (const gsNode of currentNodes) {
      grid?.removeWidget(gsNode.el!, true)
    }
    MessageUtil.success('删除成功')
  })
})
onBeforeMount(() => {
  grid?.destroy(true)
})
</script>
<style scoped lang="less"></style>

<template>
  <div class="folder-widget" :style="{ width, height }">
    <div>{{ node.meta?.root }}</div>
    <t-list size="small" split>
      <t-list-item v-for="item in list" :key="item.path">
        <t-link theme="primary" hover="underline">{{ item.name }}</t-link>
      </t-list-item>
    </t-list>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { CELL_SIZE } from '@common/global'
import { FileItemView } from '@common/views'

const props = defineProps({
  node: {
    type: Object as PropType<DesktopNode>,
    required: true
  }
})
const width = computed(() => `${(props.node.meta?.width || 1) * CELL_SIZE - 16}px`)
const height = computed(() => `${(props.node.meta?.height || 1) * CELL_SIZE - 16}px`)

const list = ref(new Array<FileItemView>())

const listFolder = async () => {
  list.value = await window.supportAPI.fs.readdir(props.node.meta!.root!)
}

onMounted(() => {
  listFolder()
})
</script>
<style scoped lang="less">
.folder-widget {
}
</style>

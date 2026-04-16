<template>
  <div class="desktop-home">
    <!-- 桌面图标网格 -->
    <DesktopGrid />

    <DockFooter />

    <!-- 添加节点弹窗 -->
    <AddNodeModal :visible="showModal" :type="modalType" @close="handleCloseModal" />
  </div>
</template>

<script lang="ts" setup>
import DesktopGrid from '@/desktop/layout/DesktopGrid.vue'
import AddNodeModal from '@/components/desktop/AddNodeModal.vue'
import DockFooter from '@/desktop/layout/DockFooter.vue'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'

type ModalType = 'app' | 'link' | null

const showModal = ref(false)
const modalType = ref<ModalType>(null)

// 关闭弹窗
const handleCloseModal = () => {
  showModal.value = false
  modalType.value = null
}

onMounted(() => {
  useDesktopNodeStore().init()
})
</script>

<style lang="less" scoped>
.desktop-home {
  min-height: 100vh;
  background: var(--td-bg-color-page);
}
</style>

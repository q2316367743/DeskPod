<template>
  <div class="desktop-home">
    <img
      v-if="background"
      :src="background"
      alt="背景图片"
      class="w-full h-full t-image--fit-contain absolute top-0 left-0 right-0 bottom-0"
      style="object-fit: cover"
    />

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
import { useDesktopNodeStore, useSettingStore } from '@/store'

type ModalType = 'app' | 'link' | null

const showModal = ref(false)
const modalType = ref<ModalType>(null)

const background = computed(() => useSettingStore().background)

// 关闭弹窗
const handleCloseModal = () => {
  showModal.value = false
  modalType.value = null
}

onMounted(() => {
  useDesktopNodeStore().init()
  useSettingStore().init()
})
</script>

<style lang="less" scoped>
.desktop-home {
  min-height: 100vh;
  background: var(--td-bg-color-container);
}
</style>

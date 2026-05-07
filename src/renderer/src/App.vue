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

    <DesktopHeader />

    <DesktopAside />

    <div class="desktop-bar"></div>
  </div>
</template>

<script lang="ts" setup>
import DesktopGrid from '@/desktop/layout/DesktopGrid.vue'
import DesktopHeader from '@/desktop/layout/DesktopHeader.vue'
import DesktopAside from '@/desktop/layout/DesktopAside.vue'
import { useDesktopNodeStore, useSettingStore } from '@/store'

const background = computed(() => useSettingStore().background)

// 关闭弹窗

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
.desktop-bar {
  width: 100vw;
  height: 8px;
  z-index: 9999999;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-app-region: drag;
}
</style>

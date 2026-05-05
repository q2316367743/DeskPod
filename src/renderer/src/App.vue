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
    <DesktopGrid v-show="isMaximized" />

    <DockFooter v-show="isMaximized" />

    <!-- 添加节点弹窗 -->

    <div class="desktop-bar"></div>

    <desktop-ball @click="handleClick" />
  </div>
</template>

<script lang="ts" setup>
import { useDesktopNodeStore, useSettingStore } from '@/store'
import DesktopGrid from '@/desktop/layout/DesktopGrid.vue'
import DockFooter from '@/desktop/layout/DockFooter.vue'
import DesktopBall from '@/desktop/layout/DesktopBall.vue'

const background = computed(() => useSettingStore().background)

const isMaximized = ref(false)

const handleClick = () => {
  console.log(isMaximized)
  window.supportAPI.main
    .toggleSize()
    .then((res) => {
      isMaximized.value = res
    })
    .catch((err) => {
      console.log(err)
    })
}

onMounted(() => {
  useDesktopNodeStore().init()
  useSettingStore().init()
})
</script>

<style lang="less" scoped>
.desktop-home {
  background: var(--td-bg-color-container);
  width: 1168px;
  height: 850px;
  min-width: 1168px;
  min-height: 850px;
  overflow: hidden;
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

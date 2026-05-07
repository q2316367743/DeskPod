<template>
  <div v-if="background" class="fixed top-0 left-0 w-full h-full">
    <video
      v-if="background.endsWith('mp4') || background.endsWith('web,')"
      class="w-full h-full absolute top-0 left-0 right-0 bottom-0"
      style="object-fit: cover"
      :src="background"
      loop
      autoplay
      muted
    />
    <img
      v-else
      :src="background"
      alt="背景图片"
      class="w-full h-full t-image--fit-contain absolute top-0 left-0 right-0 bottom-0"
      style="object-fit: cover"
    />
  </div>
</template>
<script lang="ts" setup>
import { useSettingStore } from '@/store'

const background = computed(() => useSettingStore().background)
</script>
<style scoped lang="less"></style>

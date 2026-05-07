<template>
  <div class="p-8px">
    <t-card>
      <!-- Tabs 切换明亮/暗黑主题 -->
      <t-tabs v-model="activeTab">
        <template #action>
          <div class="mt-8px">
            <t-button theme="primary" @click="handleUpload">
              <template #icon><add-icon /></template>
              上传图片/视频
            </t-button>
          </div>
        </template>
        <t-tab-panel value="light" label="明亮主题" />
        <t-tab-panel value="dark" label="暗黑主题" />
      </t-tabs>
      <div
        class="flex flex-wrap gap-16px"
        style="
          height: calc(100vh - 112px);
          margin-top: 8px;
          overflow: auto;
          align-items: flex-start;
          align-content: flex-start;
        "
      >
        <div
          v-for="img in imgList"
          :key="img"
          class="relative group cursor-pointer rounded-8px overflow-hidden"
          :style="{
            border: selected === img ? '3px solid var(--td-brand-color)' : '3px solid transparent'
          }"
          @click="handleSelectImage(img)"
        >
          <video
            v-if="img.endsWith('mp4') || img.endsWith('web,')"
            class="w-300px h-200px object-cover"
            :src="`file://${img}`"
            loop
            autoplay
            muted
          />
          <img v-else :src="`file://${img}`" :alt="img" class="w-300px h-200px object-cover" />
          <div
            v-if="selected === img"
            class="absolute top-8px right-8px bg-brand-color text-white rounded-50% w-24px h-24px flex items-center justify-center"
          >
            <check-icon size="14px" />
          </div>
          <div
            class="absolute top-8px left-8px opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <t-button
              theme="danger"
              variant="text"
              shape="square"
              size="small"
              @click.stop="handleDeleteImage(img)"
            >
              <template #icon><delete-icon size="14px" /></template>
            </t-button>
          </div>
        </div>
        <div
          v-if="lightImages.length === 0"
          class="col-span-4 flex flex-col items-center justify-center text-color-secondary py-48px"
        >
          <image-add-icon size="48px" class="mb-8px" />
          <span>暂无背景图片，请上传</span>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { AddIcon, CheckIcon, DeleteIcon, ImageAddIcon } from 'tdesign-icons-vue-next'
import { DialogPlugin } from 'tdesign-vue-next'

const activeTab = ref<'light' | 'dark'>('light')
const lightImages = ref<string[]>([])
const darkImages = ref<string[]>([])
const selectedLight = ref('')
const selectedDark = ref('')

const imgList = computed(() => {
  if (activeTab.value === 'light') {
    return lightImages.value
  } else if (activeTab.value === 'dark') {
    return darkImages.value
  }
  return []
})
const selected = computed(() => {
  if (activeTab.value === 'light') {
    return selectedLight.value
  } else if (activeTab.value === 'dark') {
    return selectedDark.value
  }
  return ''
})

const loadImages = async (theme: 'light' | 'dark') => {
  const images = await window.settingAPI.listBgImage(theme)
  if (theme === 'light') {
    lightImages.value = images
  } else {
    darkImages.value = images
  }
}

const handleSelectImage = async (path: string) => {
  const key = activeTab.value === 'light' ? 'backgroundImageLight' : 'backgroundImageDark'
  // 如果点击的是已选中的图片，则清除选择
  const current = activeTab.value === 'light' ? selectedLight.value : selectedDark.value
  if (current === path) {
    await window.settingAPI.set(key, '')
    if (activeTab.value === 'light') {
      selectedLight.value = ''
    } else {
      selectedDark.value = ''
    }
    return
  }
  await window.settingAPI.set(key, path)
  if (activeTab.value === 'light') {
    selectedLight.value = path
  } else {
    selectedDark.value = path
  }
}

const handleUpload = async () => {
  const result = await window.supportAPI.dialog.showOpenDialogSync({
    title: '选择背景图片/视频',
    filters: [
      { name: '图片', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] },
      { name: '视频', extensions: ['mp4', 'webm'] }
    ],
    properties: ['openFile']
  })
  if (result && result.length > 0) {
    await window.settingAPI.uploadBgImage(activeTab.value, result[0])
    await loadImages(activeTab.value)
  }
}

const handleDeleteImage = async (path: string) => {
  const modal = DialogPlugin.confirm({
    header: '确认删除',
    body: '确定要删除这张背景图片吗？',
    theme: 'warning',
    cancelBtn: '取消',
    confirmBtn: '确定',
    onConfirm: async () => {
      await window.settingAPI.deleteBgImage(path)
      const theme = activeTab.value as 'light' | 'dark'
      await loadImages(theme)
      const key = theme === 'light' ? 'backgroundImageLight' : 'backgroundImageDark'
      const currentPath = theme === 'light' ? selectedLight.value : selectedDark.value
      if (currentPath === path) {
        await window.settingAPI.set(key, '')
        if (theme === 'light') {
          selectedLight.value = ''
        } else {
          selectedDark.value = ''
        }
      }
      modal.destroy()
    }
  })
}

onMounted(async () => {
  await Promise.all([loadImages('light'), loadImages('dark')])
  const setting = await window.settingAPI.all()
  selectedLight.value = setting.backgroundImageLight
  selectedDark.value = setting.backgroundImageDark
})
</script>

<style scoped lang="less"></style>

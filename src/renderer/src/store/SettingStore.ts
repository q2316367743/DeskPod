import { defineStore } from 'pinia'
import { defaultSetting, Setting } from '@common/types'
import { isDark } from '@/global/Constants'

export const useSettingStore = defineStore('setting', () => {
  const setting = ref<Setting>(defaultSetting())

  const background = computed(() => {
    return isDark.value ? setting.value.backgroundImageDark : setting.value.backgroundImageLight
  })

  const init = async () => {
    setting.value = await window.settingAPI.all()
  }

  window.settingAPI.onChange(init)

  return {
    setting,
    background,
    init
  }
})

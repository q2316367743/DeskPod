<template>
  <div class="p-8px">
    <t-card>
      <t-form label-width="120px" :data="form" colon>
        <t-form-item label="开机自启" name="autoStart">
          <t-switch
            v-model="form.autoStart"
            @change="handleChange('autoStart', $event as boolean)"
          />
        </t-form-item>

        <t-form-item label="运行模式" name="mode">
          <t-radio-group
            v-model="form.mode"
            variant="default-filled"
            @change="handleChange('mode', $event as string)"
          >
            <t-radio-button value="screen">副屏模式</t-radio-button>
            <t-radio-button value="launch">启动器模式</t-radio-button>
          </t-radio-group>
        </t-form-item>

        <t-form-item v-if="form.mode === 'screen'" label="选择副屏" name="displayId">
          <div class="display-picker">
            <t-radio-group v-model="form.displayId" @change="handleDisplayChange">
              <div
                v-for="display in displays"
                :key="display.id"
                class="display-option"
                :class="{ active: form.displayId === display.id }"
              >
                <div class="display-info">
                  <t-radio :value="display.id">屏幕 {{ display.id }}</t-radio>
                  <span class="display-label">{{ display.label }}</span>
                </div>
              </div>
            </t-radio-group>
          </div>
        </t-form-item>

        <t-form-item v-else-if="form.mode === 'launch'" label="快捷键" name="shortcutKey">
          <div class="flex items-center gap-8px">
            <t-input
              v-model="form.shortcutKey"
              placeholder="请按快捷键组合"
              class="w-240px"
              readonly
            />
            <t-tag theme="primary" variant="light">
              {{ form.shortcutKey || '未设置' }}
            </t-tag>
          </div>
        </t-form-item>

        <t-form-item label="主题" name="theme">
          <t-select
            v-model="form.theme"
            class="w-240px"
            @change="handleChange('theme', $event as string)"
          >
            <t-option value="auto" label="跟随系统" />
            <t-option value="light" label="浅色" />
            <t-option value="dark" label="深色" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { Setting } from '@common/types'

interface DisplayInfo {
  id: number
  bounds: undefined
  size: undefined
  scaleFactor: number
  label: string
}

const form = reactive<Setting>({
  autoStart: false,
  mode: 'screen',
  shortcutKey: '',
  theme: 'auto',
  displayId: 0,
  backgroundImageLight: '',
  backgroundImageDark: '',
  models: []
})

const displays = ref<Array<DisplayInfo>>([])

onMounted(async () => {
  const setting = await window.settingAPI.all()
  form.autoStart = setting.autoStart
  form.mode = setting.mode
  form.shortcutKey = setting.shortcutKey
  form.theme = setting.theme
  form.displayId = setting.displayId || 0

  await loadDisplays()
})

const loadDisplays = async () => {
  displays.value = await window.settingAPI.getDisplays()
}

const handleChange = async (key: keyof Setting, value: Setting[keyof Setting]) => {
  await window.settingAPI.set(key, value)
}

const handleDisplayChange = async (value: string | number | boolean) => {
  form.displayId = Number(value)
  await window.settingAPI.set('displayId', form.displayId)
}
</script>

<style scoped lang="less">
.display-picker {
  width: 100%;
}

.display-option {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  margin-right: 16px;
  vertical-align: top;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    border-color: var(--td-brand-color);
    background: var(--td-brand-color-light);
  }

  &:hover {
    border-color: var(--td-brand-color-focus);
  }
}

.display-preview {
  width: 160px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.display-placeholder {
  color: #999;
  font-size: 12px;
}

.display-info {
  text-align: center;

  .display-label {
    display: block;
    font-size: 12px;
    color: var(--td-text-color-secondary);
    margin-top: 4px;
  }
}
</style>

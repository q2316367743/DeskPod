<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            <RefreshIcon size="20px" style="margin-right: 8px" />
            升级快应用 - {{ app?.name }}
          </h3>
          <button class="modal-close" @click="$emit('close')">
            <CloseIcon size="20px" />
          </button>
        </div>

        <div class="modal-body">
          <!-- 来源选择 -->
          <div class="form-item">
            <label class="form-label">来源</label>
            <t-radio-group v-model="form.from" variant="default-filled">
              <t-radio-button value="ai">AI 生成</t-radio-button>
              <t-radio-button value="html">HTML 文件</t-radio-button>
              <t-radio-button value="zip">ZIP 压缩包</t-radio-button>
            </t-radio-group>
          </div>

          <!-- 应用名称 -->
          <div class="form-item">
            <label class="form-label">应用名称</label>
            <t-input
              v-model="form.name"
              placeholder="请输入应用名称"
            />
          </div>

          <!-- AI 来源的表单 -->
          <template v-if="form.from === 'ai'">
            <div class="form-item">
              <label class="form-label">图标</label>
              <NFileSelect
                v-model="form.icon"
                placeholder="请选择图标文件"
                :filters="imageFilters"
                label="选择图标"
              />
            </div>
            <div class="form-item">
              <label class="form-label">根目录</label>
              <t-textarea
                v-model="form.root"
                placeholder="请输入根目录路径"
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
            </div>
          </template>

          <!-- HTML 来源的表单 -->
          <template v-else-if="form.from === 'html'">
            <div class="form-item">
              <label class="form-label">图标</label>
              <NFileSelect
                v-model="form.icon"
                placeholder="请选择图标文件"
                :filters="imageFilters"
                label="选择图标"
              />
            </div>
            <div class="form-item">
              <label class="form-label">HTML 文件</label>
              <div class="upload-area" @click="triggerHtmlUpload" @dragover.prevent @drop.prevent="handleHtmlDrop">
                <input
                  ref="htmlInput"
                  type="file"
                  accept=".html,.htm"
                  class="upload-input"
                  @change="handleHtmlFileSelect"
                />
                <div v-if="!htmlContent" class="upload-placeholder">
                  <CloudUploadIcon size="24px" />
                  <span>点击或拖拽上传 HTML 文件</span>
                </div>
                <div v-else class="upload-success">
                  <CheckCircleIcon size="24px" />
                  <span>已选择: {{ htmlFileName }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- ZIP 来源的表单 -->
          <template v-else-if="form.from === 'zip'">
            <div class="form-item">
              <label class="form-label">入口文件</label>
              <t-input
                v-model="form.entry"
                placeholder="例如: index.html"
              >
                <template #label>
                  <span>入口文件</span>
                </template>
                <template #help>
                  相对于 ZIP 压缩包内的相对路径
                </template>
              </t-input>
            </div>
            <div class="form-item">
              <label class="form-label">图标</label>
              <t-input
                v-model="form.icon"
                placeholder="例如: icon.png"
              >
                <template #label>
                  <span>图标路径</span>
                </template>
                <template #help>
                  相对于 ZIP 压缩包内的相对路径
                </template>
              </t-input>
            </div>
            <div class="form-item">
              <label class="form-label">ZIP 文件</label>
              <NFileSelect
                v-model="form.root"
                placeholder="请选择 ZIP 压缩包文件"
                :filters="zipFilters"
                label="选择 ZIP"
              />
            </div>
          </template>

          <!-- 类型和尺寸 -->
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">类型</label>
              <t-radio-group v-model="form.type" variant="default-filled">
                <t-radio-button value="window">独立窗口</t-radio-button>
                <t-radio-button value="widget">小部件</t-radio-button>
              </t-radio-group>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item half">
              <label class="form-label">宽度</label>
              <t-input-number
                v-model="form.width"
                :min="1"
                :max="9999"
                placeholder="宽度"
                style="width: 100%"
              />
            </div>
            <div class="form-item half">
              <label class="form-label">高度</label>
              <t-input-number
                v-model="form.height"
                :min="1"
                :max="9999"
                placeholder="高度"
                style="width: 100%"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">取消</button>
          <button
            class="btn btn-primary"
            :disabled="!canUpgrade || upgrading"
            @click="$emit('upgrade')"
          >
            {{ upgrading ? '升级中...' : '升级' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {
  CloseIcon,
  RefreshIcon,
  CloudUploadIcon,
  CheckCircleIcon,
} from 'tdesign-icons-vue-next'
import type { QuickApp, QuickAppCore, QuickAppFrom, QuickAppType } from '@common/types'
import NFileSelect from '@/components/native/NFileSelect.vue'

const props = defineProps<{
  visible: boolean
  app: QuickApp | null
  upgrading: boolean
}>()

const emit = defineEmits<{
  close: []
  upgrade: []
}>()

const htmlInput = ref<HTMLInputElement | null>(null)
const htmlContent = ref('')
const htmlFileName = ref('')

const form = reactive<QuickAppCore>({
  name: '',
  entry: '',
  icon: '',
  from: 'ai' as QuickAppFrom,
  type: 'window' as QuickAppType,
  width: 800,
  height: 600,
  root: ''
})

const imageFilters = [{ name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg', 'webp'] }]
const zipFilters = [{ name: 'ZIP 文件', extensions: ['zip'] }]

const canUpgrade = computed(() => {
  if (!form.name) return false
  if (form.from === 'ai') {
    return !!form.icon && !!form.root
  }
  if (form.from === 'html') {
    return !!form.icon && !!htmlContent.value
  }
  if (form.from === 'zip') {
    return !!form.entry && !!form.icon && !!form.root
  }
  return false
})

// Watch app prop changes to populate form
watch(
  () => props.app,
  (app) => {
    if (app) {
      form.name = app.name
      form.entry = app.entry
      form.icon = app.icon
      form.from = app.from
      form.type = app.type
      form.width = app.width
      form.height = app.height
      form.root = app.root
    }
  },
  { immediate: true }
)

const triggerHtmlUpload = () => {
  htmlInput.value?.click()
}

const handleHtmlFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    readFileContent(file)
  }
}

const handleHtmlDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files[0]
  if (file && (file.name.endsWith('.html') || file.name.endsWith('.htm'))) {
    readFileContent(file)
  }
}

const readFileContent = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    htmlContent.value = e.target?.result as string
    htmlFileName.value = file.name
    form.root = htmlContent.value
  }
  reader.readAsText(file)
}

const resetForm = () => {
  form.name = ''
  form.entry = ''
  form.icon = ''
  form.from = 'ai'
  form.type = 'window'
  form.width = 800
  form.height = 600
  form.root = ''
  htmlContent.value = ''
  htmlFileName.value = ''
}

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      resetForm()
    }
  }
)

const getFormData = () => {
  return { ...form }
}

defineExpose({ getFormData })
</script>

<style lang="less" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 520px;
  max-width: 90vw;
  max-height: 85vh;
  background: var(--td-bg-color-container);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-large);
  box-shadow: var(--fluent-elevation-4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--fluent-border-subtle);
  flex-shrink: 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  display: flex;
  align-items: center;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--fluent-radius-smooth);
  color: var(--td-text-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-item-hover);
    color: var(--td-text-color-primary);
  }
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--td-text-color-secondary);
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-item.half {
  flex: 1;
}

.upload-area {
  border: 2px dashed var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-smooth);
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--fluent-transition-fast);
  position: relative;

  &:hover {
    border-color: var(--fluent-accent-color);
    background: var(--fluent-accent-light);
  }
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder,
.upload-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--td-text-color-secondary);
  font-size: 14px;
}

.upload-success {
  color: var(--td-success-color-5);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: none;
  border-radius: var(--fluent-radius-smooth);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: var(--fluent-accent-color);
  color: #ffffff;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}

.btn-secondary {
  background: var(--td-bg-color-component);
  color: var(--td-text-color-secondary);

  &:hover:not(:disabled) {
    background: var(--td-bg-color-component-hover);
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--fluent-border-subtle);
  flex-shrink: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}
</style>

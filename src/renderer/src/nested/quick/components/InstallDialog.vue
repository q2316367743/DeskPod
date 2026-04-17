<template>
  <FdDialog
    title="安装快应用"
    :visible="visible"
    :submit-btn-text="installing ? '安装中...' : '安装'"
    :submit-btn-disabled="!canInstall || installing"
    @submit="$emit('install')"
    @close="$emit('close')"
  >
    <template #icon>
      <DownloadIcon size="20px" style="margin-right: 8px" />
    </template>
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
      <t-input v-model="form.name" placeholder="请输入应用名称" />
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
        <label class="form-label">html 内容</label>
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
        <div
          class="upload-area"
          @click="triggerHtmlUpload"
          @dragover.prevent
          @drop.prevent="handleHtmlDrop"
        >
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
        <t-input v-model="form.entry" placeholder="例如: index.html">
          <template #label>
            <span>入口文件</span>
          </template>
          <template #help> 相对于 ZIP 压缩包内的相对路径 </template>
        </t-input>
      </div>
      <div class="form-item">
        <label class="form-label">图标</label>
        <t-input v-model="form.icon" placeholder="例如: icon.png">
          <template #label>
            <span>图标路径</span>
          </template>
          <template #help> 相对于 ZIP 压缩包内的相对路径 </template>
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
          style="width: 200px"
        />
      </div>
      <div class="form-item half">
        <label class="form-label">高度</label>
        <t-input-number
          v-model="form.height"
          :min="1"
          :max="9999"
          placeholder="高度"
          style="width: 200px"
        />
      </div>
    </div>
  </FdDialog>
</template>

<script lang="ts" setup>
import { DownloadIcon, CloudUploadIcon, CheckCircleIcon } from 'tdesign-icons-vue-next'
import type { QuickAppCore, QuickAppFrom, QuickAppType } from '@common/types'
import NFileSelect from '@/components/native/NFileSelect.vue'
import FdDialog from '@/components/wod/FdDialog.vue'

const props = defineProps<{
  visible: boolean
  installing: boolean
}>()

defineEmits<{
  close: []
  install: []
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

const imageFilters = [
  { name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg', 'webp'] }
]
const zipFilters = [{ name: 'ZIP 文件', extensions: ['zip'] }]

const canInstall = computed(() => {
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

watch(
  () => form.type,
  (value) => {
    if (value === 'widget') {
      form.width = 4
      form.height = 2
    } else {
      form.width = 800
      form.height = 600
    }
  }
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
    // 将 HTML 内容赋值给 root
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

// Watch for dialog close to reset form
watch(
  () => props.visible,
  (val) => {
    if (!val) {
      resetForm()
    }
  }
)

// Expose form data for parent to access
const getFormData = () => {
  // For HTML from, root already contains the file content
  return { ...form }
}

defineExpose({ getFormData })
</script>

<style lang="less" scoped>
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
  width: calc(100% - 16px);
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
</style>

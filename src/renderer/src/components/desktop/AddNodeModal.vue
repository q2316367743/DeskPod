<template>
  <transition name="modal-fade">
    <div v-if="modalVisible" class="modal-overlay" @click="onModalClick">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            <AppIcon v-if="modalType === 'app'" size="20px" style="margin-right: 8px" />
            <LinkIcon v-else-if="modalType === 'link'" size="20px" style="margin-right: 8px" />
            {{ modalType === 'app' ? '添加应用' : '添加链接' }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <CloseIcon size="20px" />
          </button>
        </div>

        <div class="modal-body">
          <!-- 添加应用表单 -->
          <div v-if="modalType === 'app'" class="form-section">
            <div class="form-item">
              <label class="form-label">应用名称</label>
              <input v-model="appName" type="text" class="form-input" placeholder="例如：Chrome" />
            </div>
            <div class="form-item">
              <label class="form-label">应用路径</label>
              <div class="input-with-action">
                <input
                  v-model="appPath"
                  type="text"
                  class="form-input"
                  placeholder="例如：C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
                />
                <button class="action-btn" @click="selectApp">选择</button>
              </div>
            </div>
            <div class="form-item">
              <label class="form-label">图标 URL（可选）</label>
              <input
                v-model="iconUrl"
                type="text"
                class="form-input"
                placeholder="输入图标链接或留空自动生成"
              />
            </div>
          </div>

          <!-- 添加链接表单 -->
          <div v-else-if="modalType === 'link'" class="form-section">
            <div class="form-item">
              <label class="form-label">链接名称</label>
              <input v-model="linkName" type="text" class="form-input" placeholder="例如：GitHub" />
            </div>
            <div class="form-item">
              <label class="form-label">链接地址</label>
              <input
                v-model="linkUrl"
                type="text"
                class="form-input"
                placeholder="例如：https://github.com"
                @blur="fetchFavicon"
              />
            </div>
            <div v-if="fetchedIcon" class="icon-preview">
              <img :src="fetchedIcon" alt="favicon" class="preview-icon" />
              <span class="preview-text">已自动获取图标</span>
            </div>
            <div class="form-item">
              <label class="form-label">自定义图标 URL（可选）</label>
              <input
                v-model="iconUrl"
                type="text"
                class="form-input"
                placeholder="留空则使用自动获取的图标"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="handleSubmit">确定</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import { AppIcon, CloseIcon, LinkIcon } from 'tdesign-icons-vue-next'

type ModalType = 'app' | 'link' | null

const props = defineProps<{
  visible: boolean
  type: ModalType
}>()

const emit = defineEmits<{
  close: []
  submit: [data: { name: string; icon: string; path?: string; url?: string }]
}>()

const modalVisible = ref(false)
const modalType = ref<ModalType>(null)

// 表单数据
const appName = ref('')
const appPath = ref('')
const linkName = ref('')
const linkUrl = ref('')
const iconUrl = ref('')

// 自动获取的图标
const fetchedIcon = ref('')
const fetchingIcon = ref(false)

watch(
  () => props.visible,
  (val) => {
    modalVisible.value = val
    if (val) {
      modalType.value = props.type
      resetForm()
    }
  }
)

watch(
  () => props.type,
  (val) => {
    modalType.value = val
  }
)

const closeModal = () => {
  modalVisible.value = false
  emit('close')
}

const resetForm = () => {
  appName.value = ''
  appPath.value = ''
  linkName.value = ''
  linkUrl.value = ''
  iconUrl.value = ''
  fetchedIcon.value = ''
  fetchingIcon.value = false
}

// 自动获取网站图标
const fetchFavicon = async () => {
  if (!linkUrl.value) return

  fetchingIcon.value = true
  try {
    // 尝试从 URL 提取域名
    let url = linkUrl.value.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const urlObj = new URL(url)

    fetchedIcon.value = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`

    // 如果 preload 提供了 API，尝试获取
    if (window.desktopAPI?.fetchFavicon) {
      const result = await window.desktopAPI.fetchFavicon(url)
      if (result.success) {
        fetchedIcon.value = result.icon
      }
    }
  } catch {
    fetchedIcon.value = ''
  } finally {
    fetchingIcon.value = false
  }
}

// 选择本地应用
const selectApp = async () => {
  // 这里可以调用 electron 的文件选择对话框
  // 简化处理：让用户手动输入路径
  console.log('select app')
}

const handleSubmit = () => {
  if (modalType.value === 'app') {
    if (!appName.value || !appPath.value) {
      return
    }
    emit('submit', {
      name: appName.value,
      icon: fetchedIcon.value || iconUrl.value || '',
      path: appPath.value
    })
  } else if (modalType.value === 'link') {
    if (!linkName.value || !linkUrl.value) {
      return
    }
    let url = linkUrl.value.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    emit('submit', {
      name: linkName.value,
      icon: fetchedIcon.value || iconUrl.value || '',
      url
    })
  }
  closeModal()
}

const onModalClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}
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
  width: 420px;
  max-width: 90vw;
  background: var(--fluent-acrylic-bg);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-large);
  box-shadow: var(--fluent-elevation-4);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--fluent-border-subtle);
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
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--td-text-color-secondary);
}

.form-input {
  padding: 10px 12px;
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-smooth);
  background: var(--td-bg-color-container);
  font-size: 14px;
  color: var(--td-text-color-primary);
  outline: none;
  transition: all var(--fluent-transition-fast);

  &:focus {
    border-color: var(--fluent-accent-color);
    box-shadow: var(--fluent-focus-ring);
  }

  &::placeholder {
    color: var(--td-text-color-placeholder);
  }
}

.input-with-action {
  display: flex;
  gap: 8px;
}

.input-with-action .form-input {
  flex: 1;
}

.action-btn {
  padding: 0 16px;
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-smooth);
  background: var(--fluent-acrylic-bg);
  color: var(--td-text-color-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--fluent-transition-fast);
  white-space: nowrap;

  &:hover {
    background: var(--fluent-item-hover);
    color: var(--td-text-color-primary);
  }
}

.icon-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--td-success-color-1);
  border-radius: var(--fluent-radius-smooth);
}

.preview-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.preview-text {
  font-size: 12px;
  color: var(--td-success-color-5);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--fluent-border-subtle);
}

.btn {
  padding: 8px 24px;
  border: none;
  border-radius: var(--fluent-radius-smooth);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &:active {
    transform: scale(0.97);
  }
}

.btn-secondary {
  background: var(--td-bg-color-component);
  color: var(--td-text-color-secondary);

  &:hover {
    background: var(--td-bg-color-component-hover);
  }
}

.btn-primary {
  background: var(--fluent-accent-color);
  color: #ffffff;

  &:hover {
    opacity: 0.9;
  }
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

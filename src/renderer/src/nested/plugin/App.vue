<template>
  <div class="modal-container">
    <div class="modal-header">
      <h3 class="modal-title">
        <DownloadIcon size="20px" style="margin-right: 8px" />
        安装插件
      </h3>
    </div>

    <div class="modal-body">
      <div
        v-if="verifyResult"
        class="verify-result"
        :class="verifyResult.exists ? 'verify-warning' : 'verify-success'"
      >
        <div v-if="!verifyResult.exists" class="verify-info">
          <CheckCircleIcon size="16px" />
          <span>插件验证通过，可以安装</span>
        </div>
        <div v-else class="verify-info">
          <InfoCircleIcon size="16px" />
          <span>插件已安装，将执行升级操作</span>
        </div>
      </div>

      <div v-if="verifyResult?.config" class="plugin-preview">
        <div class="preview-header">
          <img
            v-if="verifyResult.config.icon"
            :src="verifyResult.config.icon"
            class="preview-icon"
          />
          <div class="preview-title">
            <div class="preview-name">{{ verifyResult.config.productName }}</div>
            <div class="preview-version">v{{ verifyResult.config.version }}</div>
          </div>
        </div>
        <div class="preview-details">
          <div v-if="verifyResult.config.main" class="preview-item">
            <span class="preview-label">主窗口：</span>
            <span>{{ verifyResult.config.main.title }}</span>
          </div>
          <div v-if="verifyResult.config.widgets?.length" class="preview-item">
            <span class="preview-label">小部件：</span>
            <span>{{ verifyResult.config.widgets.length }} 个</span>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary" @click="handleClose">取消</button>
      <button
        class="btn btn-primary"
        :disabled="!path || verifying || !!verifyResult?.exists"
        @click="handleInstall"
      >
        {{ labelBtn }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DownloadIcon, CheckCircleIcon, InfoCircleIcon } from 'tdesign-icons-vue-next'
import { PluginVerifyResult } from '@common/types'

const error = ref(false)
const verifyResult = ref<PluginVerifyResult>()
const loading = ref(false)

const verifying = computed(() => !!verifyResult.value)
const labelBtn = computed(() => {
  if (verifying.value) {
    if (verifyResult.value?.exists) {
      if (loading.value) {
        return '升级中...'
      }
      return '升级'
    } else {
      if (loading.value) {
        return '安装中...'
      }
      return '安装'
    }
  }
  return '安装'
})

const s = new URLSearchParams(window.location.search)
const path = s.get('path')

const handleClose = () => window.close()

const handleInstall = async (): Promise<void> => {}

onMounted(() => {
  if (!path) {
    error.value = true
    return
  }
  window.pluginAPI.verify(path).then((res) => {
    verifyResult.value = res
  })
})
</script>

<style lang="less" scoped>
.modal-container {
  width: 100vw;
  height: 100vh;
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
}

.verify-result {
  padding: 12px;
  border-radius: var(--fluent-radius-smooth);
  margin-bottom: 16px;
}

.verify-success {
  background: var(--td-success-color-1);
  border: 1px solid var(--td-success-color-3);
}

.verify-warning {
  background: var(--td-warning-color-1);
  border: 1px solid var(--td-warning-color-3);
}

.verify-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--td-text-color-primary);
}

.plugin-preview {
  padding: 12px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--fluent-radius-smooth);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--fluent-radius-smooth);
  object-fit: cover;
}

.preview-title {
  flex: 1;
}

.preview-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.preview-version {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-item {
  font-size: 13px;
  color: var(--td-text-color-secondary);
}

.preview-label {
  font-weight: 500;
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

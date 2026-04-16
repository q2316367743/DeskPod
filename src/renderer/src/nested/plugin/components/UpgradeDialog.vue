<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            <RefreshIcon size="20px" style="margin-right: 8px" />
            升级插件 - {{ plugin?.productName }}
          </h3>
          <button class="modal-close" @click="$emit('close')">
            <CloseIcon size="20px" />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">插件包路径</label>
            <div class="input-with-action">
              <input
                :value="path"
                @input="$emit('update:path', ($event.target as HTMLInputElement).value)"
                type="text"
                class="form-input"
                placeholder="选择新版本插件包(.zip)文件路径"
              />
              <button class="action-btn" @click="$emit('select')">选择文件</button>
            </div>
          </div>

          <div v-if="verifyResult" class="verify-result verify-success">
            <div class="verify-info">
              <CheckCircleIcon size="16px" />
              <span>新版本验证通过</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">取消</button>
          <button
            class="btn btn-primary"
            :disabled="!path || upgrading"
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
  CheckCircleIcon,
} from 'tdesign-icons-vue-next'
import type { PluginEntityWrap, PluginVerifyResult } from '@common/types/PluginEntity'

defineProps<{
  visible: boolean
  plugin: PluginEntityWrap | null
  path: string
  verifyResult: PluginVerifyResult | null
  upgrading: boolean
}>()

defineEmits<{
  close: []
  'update:path': [path: string]
  select: []
  upgrade: []
}>()
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
  width: 440px;
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

.verify-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--td-text-color-primary);
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

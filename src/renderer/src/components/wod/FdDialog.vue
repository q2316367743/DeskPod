<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <div class="flex items-center">
            <slot name="icon" />
            <h3 class="modal-title">{{ title }}</h3>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <CloseIcon size="20px" />
          </button>
        </div>

        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <t-button theme="default" @click="$emit('close')">取消</t-button>
          <t-button
            theme="primary"
            :disabled="submitBtnDisabled"
            :loading="submitBtnLoading"
            @click="$emit('submit')"
          >
            {{ submitBtnText || '确定' }}
          </t-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import { CloseIcon } from 'tdesign-icons-vue-next'

defineProps<{
  visible: boolean
  title?: string
  submitBtnText?: string
  submitBtnLoading?: boolean
  submitBtnDisabled?: boolean
}>()

defineSlots<{
  icon: () => void
}>()

defineEmits<{
  close: []
  submit: []
}>()
</script>
<style scoped lang="less">
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

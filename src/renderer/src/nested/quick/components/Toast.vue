<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="`toast-${type}`">
      <div class="toast-icon">
        <CheckCircleIcon v-if="type === 'success'" size="16px" />
        <ErrorCircleIcon v-else-if="type === 'error'" size="16px" />
        <InfoCircleIcon v-else size="16px" />
      </div>
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {
  CheckCircleIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
} from 'tdesign-icons-vue-next'

defineProps<{
  visible: boolean
  type: 'success' | 'error' | 'info'
  message: string
}>()
</script>

<style lang="less" scoped>
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--fluent-radius-smooth);
  box-shadow: var(--fluent-elevation-3);
  z-index: 2000;
}

.toast-success {
  background: var(--td-success-color-1);
  border: 1px solid var(--td-success-color-3);
  color: var(--td-success-color-5);
}

.toast-error {
  background: var(--td-error-color-1);
  border: 1px solid var(--td-error-color-3);
  color: var(--td-error-color-3);
}

.toast-info {
  background: var(--td-brand-color-1);
  border: 1px solid var(--td-brand-color-3);
  color: var(--td-brand-color-7);
}

.toast-message {
  font-size: 14px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>

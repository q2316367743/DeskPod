<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div v-if="plugin" class="modal-container modal-container-lg">
        <div class="modal-header">
          <div class="detail-header">
            <div class="detail-icon">
              <img v-if="plugin.icon" :src="iconSrc" :alt="plugin.productName" />
              <div v-else class="plugin-icon-placeholder plugin-icon-lg">
                {{ plugin.productName.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="detail-title">
              <h3 class="modal-title" style="margin: 0">
                {{ plugin.productName }}
              </h3>
              <div class="plugin-meta">
                <span class="plugin-id">{{ plugin.identifier }}</span>
                <span class="plugin-version">v{{ plugin.version }}</span>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <CloseIcon size="20px" />
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h4 class="section-title">基本信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">标识符</span>
                <span class="info-value">{{ plugin.identifier }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">版本</span>
                <span class="info-value">{{ plugin.version }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">安装路径</span>
                <span class="info-value" :title="plugin.root">{{ plugin.root }}</span>
              </div>
            </div>
          </div>

          <div v-if="plugin.main" class="detail-section">
            <h4 class="section-title">主窗口</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">窗口标题</span>
                <span class="info-value">{{ plugin.main.title }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">窗口标识</span>
                <span class="info-value">{{ plugin.main.label }}</span>
              </div>
              <div class="info-item" v-if="plugin.main.width || plugin.main.height">
                <span class="info-label">窗口尺寸</span>
                <span class="info-value">
                  {{ plugin.main.width || '自适应' }} × {{ plugin.main.height || '自适应' }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="plugin.weight && plugin.weight.length > 0" class="detail-section">
            <h4 class="section-title">小部件</h4>
            <div class="weight-grid">
              <div v-for="(weight, index) in plugin.weight" :key="index" class="weight-card">
                <div class="weight-preview">
                  <img v-if="weight.preview" :src="assetSrc(weight.preview)" :alt="weight.title" />
                  <div v-else class="weight-placeholder">
                    {{ weight.title.charAt(0) }}
                  </div>
                </div>
                <div class="weight-info">
                  <div class="weight-name">{{ weight.title }}</div>
                  <div class="weight-label">{{ weight.label }}</div>
                  <div class="weight-layouts">
                    <span v-for="(layout, i) in weight.layouts" :key="i" class="layout-tag">
                      {{ layout.rows }}×{{ layout.cols }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="section-title">权限</h4>
            <div class="capabilities-list">
              <span v-for="(cap, index) in plugin.capabilities" :key="index" class="capability-tag">
                {{ typeof cap === 'string' ? cap : cap.identifier }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">关闭</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { CloseIcon } from 'tdesign-icons-vue-next'
import type { PluginEntityWrap } from '@common/types'

const props = defineProps<{
  visible: boolean
  plugin: PluginEntityWrap | null
}>()

defineEmits<{
  close: []
}>()

const iconSrc = computed(() => {
  const plugin = unref(props.plugin)
  if (!plugin?.icon) return ''
  return `file://${plugin.root}/runtime/${plugin.icon}`
})

const assetSrc = (assetPath: string) => {
  const plugin = unref(props.plugin)
  if (!plugin) return ''
  return `file://${plugin.root}/${assetPath}`
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
  width: 600px;
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

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--fluent-radius-card);
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.plugin-icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fluent-gradient-primary);
  color: #ffffff;
  font-weight: 600;
}

.plugin-icon-lg {
  font-size: 28px;
}

.detail-title {
  flex: 1;
}

.plugin-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.plugin-id {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  font-family: 'Cascadia Code', 'Fira Code', monospace;
}

.plugin-version {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  background: var(--td-bg-color-secondarycontainer);
  padding: 2px 8px;
  border-radius: var(--fluent-radius-round);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--fluent-border-subtle);
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
}

.btn-secondary {
  background: var(--td-bg-color-component);
  color: var(--td-text-color-secondary);

  &:hover:not(:disabled) {
    background: var(--td-bg-color-component-hover);
  }
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--fluent-border-subtle);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
}

.info-value {
  font-size: 14px;
  color: var(--td-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
}

.weight-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.weight-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--fluent-radius-smooth);
}

.weight-preview {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.weight-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fluent-gradient-secondary);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border-radius: 6px;
}

.weight-info {
  flex: 1;
  min-width: 0;
}

.weight-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 2px;
}

.weight-label {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin-bottom: 6px;
}

.weight-layouts {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.layout-tag {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--fluent-accent-light);
  color: var(--fluent-accent-color);
  border-radius: var(--fluent-radius-smooth);
}

.capabilities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.capability-tag {
  font-size: 12px;
  padding: 4px 10px;
  background: var(--td-bg-color-secondarycontainer);
  color: var(--td-text-color-secondary);
  border-radius: var(--fluent-radius-round);
  font-family: 'Cascadia Code', 'Fira Code', monospace;
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

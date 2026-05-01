<template>
  <div class="modal-container">
    <div class="modal-header">
      <h3 class="modal-title">
        <DownloadIcon size="20px" style="margin-right: 8px" />
        安装插件
      </h3>
    </div>

    <div class="modal-body">
      <!-- 验证状态 -->
      <div
        v-if="verifyResult"
        class="verify-banner"
        :class="verifyResult.exists ? 'verify-warning' : 'verify-success'"
      >
        <component :is="verifyResult.exists ? InfoCircleIcon : CheckCircleIcon" size="16px" />
        <span>{{
          verifyResult.exists ? '插件已安装，将执行升级操作' : '插件验证通过，可以安装'
        }}</span>
      </div>

      <template v-if="verifyResult?.config">
        <!-- 基本信息 -->
        <section class="section">
          <div class="section-title">基本信息</div>
          <div class="basic-info">
            <img
              v-if="icon"
              :src="icon"
              :alt="verifyResult.config.productName"
              class="plugin-icon"
            />
            <div class="info-main">
              <div class="info-name">{{ verifyResult.config.productName }}</div>
              <div class="info-version">v{{ verifyResult.config.version }}</div>
              <div v-if="verifyResult.config.description" class="info-desc">
                {{ verifyResult.config.description }}
              </div>
              <div
                v-if="verifyResult.config.author || verifyResult.config.homepage"
                class="info-meta"
              >
                <span v-if="verifyResult.config.author" class="meta-item">
                  <span class="meta-label">开发者</span>
                  <span class="meta-value">{{ verifyResult.config.author }}</span>
                </span>
                <span v-if="verifyResult.config.homepage" class="meta-item">
                  <span class="meta-label">官网</span>
                  <a class="meta-link" :href="verifyResult.config.homepage" target="_blank">
                    {{ verifyResult.config.homepage }}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 许可证 -->
        <section v-if="verifyResult.config.license" class="section">
          <div class="section-title">许可证</div>
          <div class="license-value">{{ verifyResult.config.license }}</div>
        </section>

        <!-- 小部件 -->
        <section v-if="verifyResult.config.widgets?.length" class="section">
          <div class="section-title">小部件</div>
          <div class="widget-list">
            <div
              v-for="(widget, idx) in verifyResult.config.widgets"
              :key="idx"
              class="widget-card"
            >
              <img v-if="widget.preview" :src="widget.preview" class="widget-preview" />
              <div class="widget-info">
                <div class="widget-name">{{ widget.title }}</div>
                <div class="widget-label">{{ widget.label }}</div>
                <div v-if="widget.layouts?.length" class="widget-layouts">
                  <span class="widget-meta-label">支持布局</span>
                  <span v-for="(layout, li) in widget.layouts" :key="li" class="layout-tag">
                    {{ layout.cols }}×{{ layout.rows }}
                  </span>
                </div>
                <div v-if="widget.menu?.length" class="widget-menus">
                  <span class="widget-meta-label">菜单项</span>
                  <span v-for="(menu, mi) in widget.menu" :key="mi" class="menu-tag">
                    {{ menu.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 权限 -->
        <section
          v-if="verifyResult.config.capabilities?.length"
          class="section section-permissions"
        >
          <div class="section-title">
            <LockOnIcon size="14px" style="margin-right: 4px" />
            权限
          </div>
          <div class="capability-list">
            <div
              v-for="(cap, idx) in verifyResult.config.capabilities"
              :key="idx"
              class="capability-item"
            >
              <span class="cap-name">{{ isStringCap(cap) ? cap : cap.identifier }}</span>
              <template v-if="!isStringCap(cap)">
                <span v-if="cap.allow?.length" class="cap-detail cap-allow">
                  允许：{{ cap.allow.join(', ') }}
                </span>
                <span v-if="cap.deny?.length" class="cap-detail cap-deny">
                  拒绝：{{ cap.deny.join(', ') }}
                </span>
              </template>
            </div>
          </div>
        </section>
      </template>
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
import { DownloadIcon, CheckCircleIcon, InfoCircleIcon, LockOnIcon } from 'tdesign-icons-vue-next'
import { PluginEntityCapability, PluginVerifyResult } from '@common/types'

const error = ref(false)
const verifyResult = ref<PluginVerifyResult>()
const loading = ref(false)

const verifying = computed(() => !!verifyResult.value)
const labelBtn = computed(() => {
  if (verifying.value) {
    if (verifyResult.value?.exists) {
      if (loading.value) return '升级中...'
      return '升级'
    } else {
      if (loading.value) return '安装中...'
      return '安装'
    }
  }
  return '安装'
})
const icon = computed(() => {
  if (!verifyResult.value) return ''
  return verifyResult.value.config.icon
})

const s = new URLSearchParams(window.location.search)
const path = s.get('path')

const handleClose = () => window.close()
const handleInstall = async (): Promise<void> => {}

function isStringCap(cap: PluginEntityCapability): cap is string {
  return typeof cap === 'string'
}

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

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--fluent-border-subtle);
  flex-shrink: 0;
}

/* Verify banner */
.verify-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: var(--fluent-radius-smooth);
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--td-text-color-primary);
}

.verify-success {
  background: var(--td-success-color-1);
  border: 1px solid var(--td-success-color-3);
}

.verify-warning {
  background: var(--td-warning-color-1);
  border: 1px solid var(--td-warning-color-3);
}

/* Section */
.section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--td-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--fluent-border-subtle);
  display: flex;
  align-items: center;
}

.section-permissions .section-title {
  color: var(--td-warning-color);
}

/* Basic info */
.basic-info {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.plugin-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--fluent-radius-smooth);
  object-fit: cover;
  flex-shrink: 0;
}

.info-main {
  flex: 1;
  min-width: 0;
}

.info-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.info-version {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin-top: 2px;
}

.info-desc {
  font-size: 13px;
  color: var(--td-text-color-secondary);
  margin-top: 6px;
  line-height: 1.5;
}

.info-meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
}

.meta-item {
  font-size: 13px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.meta-label {
  color: var(--td-text-color-placeholder);
  flex-shrink: 0;
}

.meta-value {
  color: var(--td-text-color-primary);
}

.meta-link {
  color: var(--fluent-accent-color);
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
}

/* License */
.license-value {
  font-size: 13px;
  color: var(--td-text-color-primary);
  padding: 8px 12px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--fluent-radius-smooth);
  display: inline-block;
}

/* Widgets */
.widget-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.widget-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--fluent-radius-smooth);
}

.widget-preview {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--td-bg-color-component);
}

.widget-info {
  flex: 1;
  min-width: 0;
}

.widget-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.widget-label {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin-top: 2px;
  font-family: monospace;
}

.widget-meta-label {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin-right: 4px;
}

.widget-layouts,
.widget-menus {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  margin-top: 6px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.layout-tag,
.menu-tag {
  display: inline-block;
  padding: 1px 6px;
  background: var(--td-bg-color-component);
  border-radius: var(--fluent-radius-smooth);
  font-size: 11px;
  color: var(--td-text-color-secondary);
}

/* Capabilities */
.capability-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--fluent-radius-smooth);
  font-size: 13px;
  flex-wrap: wrap;
  border-left: 3px solid var(--td-warning-color);
}

.cap-name {
  color: var(--td-text-color-primary);
  font-weight: 500;
}

.cap-detail {
  font-size: 12px;
  margin-left: auto;
  padding-left: 12px;
  border-left: 1px solid var(--fluent-border-subtle);
}

.cap-allow {
  color: var(--td-success-color);
}

.cap-deny {
  color: var(--td-error-color);
}

/* Buttons */
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

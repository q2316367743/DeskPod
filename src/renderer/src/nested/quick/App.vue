<template>
  <div class="quick-app-manager">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <h1 class="page-title">快应用管理</h1>
      <div class="toolbar-actions">
        <t-dropdown trigger="click" max-column-width="200px">
          <t-button theme="primary">
            <template #icon>
              <AddIcon />
            </template>
            安装快应用
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item>AI 生成</t-dropdown-item>
            <t-dropdown-item @click="openInstallQuickApp('html', loadApps)">
              <template #prefix-icon>
                <html5-icon />
              </template>
              HTML 文件
            </t-dropdown-item>
            <t-dropdown-item @click="openInstallQuickApp('zip', loadApps)">
              <template #prefix-icon>
                <file-zip-icon />
              </template>
              <t-tooltip content="npm run build 后的产物，dist 文件夹内进行压缩">
                ZIP 文件
              </t-tooltip>
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </div>
    </div>

    <!-- 快应用列表 -->
    <t-loading :loading="loading" class="app-list">
      <div v-if="apps.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📦</div>
        <p class="empty-text">暂无已安装的快应用</p>
        <p class="empty-hint">点击"安装快应用"开始使用</p>
      </div>

      <QuickAppCard
        v-for="app in apps"
        :key="app.id"
        :app="app"
        @upgrade="openUpgradeDialog"
        @uninstall="confirmUninstall"
      />
    </t-loading>

    <!-- 安装弹窗 -->
    <InstallDialog
      ref="installDialogRef"
      :visible="installDialogVisible"
      :installing="installing"
      @close="closeInstallDialog"
      @install="doInstall"
    />

    <!-- 升级弹窗 -->
    <UpgradeDialog
      ref="upgradeDialogRef"
      :visible="upgradeDialogVisible"
      :app="upgradingApp"
      :upgrading="upgrading"
      @close="closeUpgradeDialog"
      @upgrade="doUpgrade"
    />

    <!-- 消息提示 -->
    <Toast :visible="toast.visible" :type="toast.type" :message="toast.message" />
  </div>
</template>

<script lang="ts" setup>
import { AddIcon, FileZipIcon, Html5Icon } from 'tdesign-icons-vue-next'
import type { QuickApp, QuickAppCore } from '@common/types'
import QuickAppCard from '@/nested/quick/components/QuickAppCard.vue'
import InstallDialog from '@/nested/quick/components/InstallDialog.vue'
import UpgradeDialog from '@/nested/quick/components/UpgradeDialog.vue'
import Toast from '@/nested/quick/components/Toast.vue'
import { useColorMode } from '@/hooks'
import { openInstallQuickApp } from '@/nested/quick/func/InstallQuickApp'

const installDialogRef = ref<InstanceType<typeof InstallDialog> | null>(null)
const upgradeDialogRef = ref<InstanceType<typeof UpgradeDialog> | null>(null)

interface State {
  apps: QuickApp[]
  loading: boolean
  installing: boolean
  upgrading: boolean
  installDialogVisible: boolean
  upgradeDialogVisible: boolean
  upgradingApp: QuickApp | null
  toast: {
    visible: boolean
    type: 'success' | 'error' | 'info'
    message: string
  }
}

const state = reactive<State>({
  apps: [],
  loading: false,
  installing: false,
  upgrading: false,
  installDialogVisible: false,
  upgradeDialogVisible: false,
  upgradingApp: null,
  toast: {
    visible: false,
    type: 'success',
    message: ''
  }
})

const {
  apps,
  loading,
  installing,
  upgrading,
  installDialogVisible,
  upgradeDialogVisible,
  upgradingApp,
  toast
} = toRefs(state)

// 加载快应用列表
const loadApps = async () => {
  state.loading = true
  try {
    state.apps = await window.quickAPI.list()
  } catch (e) {
    showToast('error', '加载快应用列表失败')
    console.error(e)
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  loadApps()
})

// 消息提示
const showToast = (type: 'success' | 'error' | 'info', message: string) => {
  state.toast = { visible: true, type, message }
  setTimeout(() => {
    state.toast.visible = false
  }, 3000)
}

// 安装
const openInstallDialog = () => {
  state.installDialogVisible = true
}

const closeInstallDialog = () => {
  state.installDialogVisible = false
}

const doInstall = async () => {
  const formData = installDialogRef.value?.getFormData()
  if (!formData) return
  state.installing = true
  try {
    await window.quickAPI.install(formData as QuickAppCore)
    showToast('success', '快应用安装成功')
    closeInstallDialog()
    loadApps()
  } catch (e) {
    showToast('error', '快应用安装失败')
    console.error(e)
  } finally {
    state.installing = false
  }
}

// 升级
const openUpgradeDialog = (app: QuickApp) => {
  state.upgradingApp = app
  state.upgradeDialogVisible = true
}

const closeUpgradeDialog = () => {
  state.upgradeDialogVisible = false
  state.upgradingApp = null
}

const doUpgrade = async () => {
  const formData = upgradeDialogRef.value?.getFormData()
  if (!formData || !state.upgradingApp) return
  state.upgrading = true
  try {
    await window.quickAPI.upgrade(state.upgradingApp.id, formData as QuickAppCore)
    showToast('success', '快应用升级成功')
    closeUpgradeDialog()
    loadApps()
  } catch (e) {
    showToast('error', '快应用升级失败')
    console.error(e)
  } finally {
    state.upgrading = false
  }
}

// 卸载
const confirmUninstall = (app: QuickApp) => {
  if (confirm(`确定要卸载 "${app.name}" 吗？`)) {
    doUninstall(app.id)
  }
}

const doUninstall = async (id: string) => {
  try {
    await window.quickAPI.uninstall(id)
    showToast('success', '快应用已卸载')
    loadApps()
  } catch (e) {
    showToast('error', '卸载失败')
    console.error(e)
  }
}

useColorMode()
</script>

<style lang="less" scoped>
.quick-app-manager {
  min-height: calc(100vh - 48px);
  background: var(--td-bg-color-page);
  padding: 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: var(--td-text-color-primary);
  margin: 0 0 8px;
}

.empty-hint {
  font-size: 13px;
  color: var(--td-text-color-placeholder);
  margin: 0;
}

[v-loading] {
  position: relative;
}

[v-loading]::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

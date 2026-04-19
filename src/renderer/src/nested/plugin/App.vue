<template>
  <div class="plugin-manager">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <h1 class="page-title">插件管理</h1>
      <div class="toolbar-actions">
        <button class="btn btn-primary" @click="openInstallDialog">
          <PlusIcon size="16px" />
          安装插件
        </button>
      </div>
    </div>

    <!-- 插件列表 -->
    <div v-loading="loading" class="plugin-list">
      <div v-if="plugins.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📦</div>
        <p class="empty-text">暂无已安装的插件</p>
        <p class="empty-hint">点击"安装插件"开始使用插件</p>
      </div>

      <PluginCard
        v-for="plugin in plugins"
        :key="plugin.identifier"
        :plugin="plugin"
        @hover="hoverPlugin = $event"
        @detail="showPluginDetail"
        @upgrade="openUpgradeDialog"
        @uninstall="confirmUninstall"
      />
    </div>

    <!-- 安装插件弹窗 -->
    <InstallDialog
      :visible="installDialogVisible"
      :path="installPath"
      :verify-result="verifyResult"
      :verifying="verifying"
      :installing="installing"
      @close="closeInstallDialog"
      @update:path="installPath = $event"
      @select="selectInstallFile"
      @install="doInstall"
    />

    <!-- 升级插件弹窗 -->
    <UpgradeDialog
      :visible="upgradeDialogVisible"
      :plugin="upgradingPlugin"
      :path="upgradePath"
      :verify-result="verifyResult"
      :upgrading="upgrading"
      @close="closeUpgradeDialog"
      @update:path="upgradePath = $event"
      @select="selectUpgradeFile"
      @upgrade="doUpgrade"
    />

    <!-- 插件详情弹窗 -->
    <DetailDialog :visible="!!detailPlugin" :plugin="detailPlugin" @close="closeDetail" />

    <!-- 消息提示 -->
    <Toast :visible="toast.visible" :type="toast.type" :message="toast.message" />
  </div>
</template>

<script lang="ts" setup>
import { PlusIcon } from 'tdesign-icons-vue-next'
import type { PluginEntityWrap, PluginVerifyResult } from '@common/types'
import PluginCard from '@/nested/plugin/components/PluginCard.vue'
import InstallDialog from '@/nested/plugin/components/InstallDialog.vue'
import UpgradeDialog from '@/nested/plugin/components/UpgradeDialog.vue'
import DetailDialog from '@/nested/plugin/components/DetailDialog.vue'
import Toast from '@/nested/plugin/components/Toast.vue'
import { MessageUtil } from '@/utils'
import { useColorMode } from '@/hooks'

interface PluginState {
  plugins: PluginEntityWrap[]
  loading: boolean
  installing: boolean
  upgrading: boolean
  verifying: boolean
  hoverPlugin: string
  installDialogVisible: boolean
  upgradeDialogVisible: boolean
  installPath: string
  upgradePath: string
  verifyResult: PluginVerifyResult | null
  upgradingPlugin: PluginEntityWrap | null
  detailPlugin: PluginEntityWrap | null
  toast: {
    visible: boolean
    type: 'success' | 'error' | 'info'
    message: string
  }
}

const state = reactive<PluginState>({
  plugins: [],
  loading: false,
  installing: false,
  upgrading: false,
  verifying: false,
  hoverPlugin: '',
  installDialogVisible: false,
  upgradeDialogVisible: false,
  installPath: '',
  upgradePath: '',
  verifyResult: null,
  upgradingPlugin: null,
  detailPlugin: null,
  toast: {
    visible: false,
    type: 'success',
    message: ''
  }
})

const {
  plugins,
  loading,
  installing,
  upgrading,
  verifying,
  hoverPlugin,
  installDialogVisible,
  upgradeDialogVisible,
  installPath,
  upgradePath,
  verifyResult,
  upgradingPlugin,
  detailPlugin,
  toast
} = toRefs(state)

// 加载插件列表
const loadPlugins = async () => {
  state.loading = true
  try {
    state.plugins = await window.pluginAPI.list()
    console.log(state.plugins)
  } catch (e) {
    showToast('error', '加载插件列表失败')
    console.error(e)
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  loadPlugins()
})

// 消息提示
const showToast = (type: 'success' | 'error' | 'info', message: string) => {
  state.toast = { visible: true, type, message }
  setTimeout(() => {
    state.toast.visible = false
  }, 3000)
}

// 安装插件
const openInstallDialog = () => {
  state.installDialogVisible = true
  state.installPath = ''
  state.verifyResult = null
}

const closeInstallDialog = () => {
  state.installDialogVisible = false
  state.installPath = ''
  state.verifyResult = null
}

const selectInstallFile = async () => {
  const paths = await window.supportAPI.shellOpenDialog({
    title: '请选择安装包',
    properties: ['openFile'],
    buttonLabel: '安装',
    filters: [
      {
        name: '安装包',
        extensions: ['zip']
      }
    ]
  })
  if (!paths || paths.length === 0) {
    MessageUtil.error('请选择安装包')
  }
  state.installPath = paths![0]!
  await verifyPlugin(state.installPath)
}

const verifyPlugin = async (path: string) => {
  if (!path) return
  state.verifying = true
  try {
    state.verifyResult = await window.pluginAPI.verify(path)
  } catch (e) {
    showToast('error', '插件验证失败')
    console.error(e)
  } finally {
    state.verifying = false
  }
}

const doInstall = async () => {
  if (!state.installPath || !state.verifyResult) return
  state.installing = true
  try {
    await window.pluginAPI.install(state.installPath)
    showToast('success', '插件安装成功')
    closeInstallDialog()
    loadPlugins()
  } catch (e) {
    showToast('error', '插件安装失败')
    console.error(e)
  } finally {
    state.installing = false
  }
}

// 升级插件
const openUpgradeDialog = (plugin: PluginEntityWrap) => {
  state.upgradingPlugin = plugin
  state.upgradeDialogVisible = true
  state.upgradePath = ''
  state.verifyResult = null
}

const closeUpgradeDialog = () => {
  state.upgradeDialogVisible = false
  state.upgradingPlugin = null
  state.upgradePath = ''
  state.verifyResult = null
}

const selectUpgradeFile = async () => {
  const paths = await window.supportAPI.shellOpenDialog({
    title: '请选择插件安装包',
    properties: ['openFile'],
    filters: [
      {
        name: '安装包',
        extensions: ['zip']
      }
    ],
    buttonLabel: '选择'
  })
  if (!paths || !paths[0]) {
    return MessageUtil.error('请选择插件安装盘路径')
  }
  state.upgradePath = paths[0]
  await verifyPlugin(state.upgradePath)
}

const doUpgrade = async () => {
  if (!state.upgradePath || !state.upgradingPlugin) return
  state.upgrading = true
  try {
    await window.pluginAPI.upgrade(state.upgradingPlugin.identifier, state.upgradePath)
    showToast('success', '插件升级成功')
    closeUpgradeDialog()
    loadPlugins()
  } catch (e) {
    showToast('error', '插件升级失败')
    console.error(e)
  } finally {
    state.upgrading = false
  }
}

// 卸载插件
const confirmUninstall = (plugin: PluginEntityWrap) => {
  if (confirm(`确定要卸载 "${plugin.productName}" 吗？`)) {
    doUninstall(plugin.identifier)
  }
}

const doUninstall = async (identifier: string) => {
  try {
    await window.pluginAPI.uninstall(identifier)
    showToast('success', '插件已卸载')
    loadPlugins()
  } catch (e) {
    showToast('error', '卸载失败')
    console.error(e)
  }
}

// 查看详情
const showPluginDetail = (plugin: PluginEntityWrap) => {
  state.detailPlugin = plugin
}

const closeDetail = () => {
  state.detailPlugin = null
}

// 监听路径变化自动验证
watch(
  () => state.installPath,
  (val) => {
    if (val) verifyPlugin(val)
    else state.verifyResult = null
  }
)

watch(
  () => state.upgradePath,
  (val) => {
    if (val) verifyPlugin(val)
    else state.verifyResult = null
  }
)

useColorMode()
</script>

<style lang="less" scoped>
.plugin-manager {
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

// 插件列表
.plugin-list {
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

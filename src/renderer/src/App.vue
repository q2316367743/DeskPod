<template>
  <div class="desktop-home">
    <!-- 日期时间 -->
    <DateTimeHeader />

    <!-- 搜索栏 -->
    <SearchBar />

    <!-- 桌面图标网格 -->
    <DesktopGrid
      :items="desktopItems"
      @click="handleIconClick"
      @contextmenu="handleContextMenu"
      @add-app="handleAddApp"
      @add-link="handleAddLink"
    />

    <!-- 添加节点弹窗 -->
    <AddNodeModal
      :visible="showModal"
      :type="modalType"
      @close="handleCloseModal"
      @submit="handleSubmitNode"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { DesktopNode } from '@common/types/DesktopNode'
import DateTimeHeader from '@/components/desktop/DateTimeHeader.vue'
import SearchBar from '@/components/desktop/SearchBar.vue'
import DesktopGrid from '@/components/desktop/DesktopGrid.vue'
import AddNodeModal from '@/components/desktop/AddNodeModal.vue'
import { MessageUtil } from '@/utils'

type ModalType = 'app' | 'link' | null

const desktopItems = ref<DesktopNode[]>([])
const showModal = ref(false)
const modalType = ref<ModalType>(null)
const DEFAULT_DESKTOP_ID = 'desktop-1'

// 加载桌面数据
const loadDesktopData = async () => {
  if (window.desktopAPI) {
    try {
      const data = await window.desktopAPI.getTree(DEFAULT_DESKTOP_ID)
      desktopItems.value = data.items || []
    } catch (error) {
      console.error('Failed to load desktop data:', error)
    }
  }
}

// 点击图标
const handleIconClick = async (node: DesktopNode) => {
  if (window.desktopAPI) {
    await window.desktopAPI.openApp(node)
  }
}

// 右键菜单
const handleContextMenu = (_node: DesktopNode, e: MouseEvent) => {
  console.log('contextmenu', e)
}

// 打开添加应用弹窗
const handleAddApp = () => {
  modalType.value = 'app'
  showModal.value = true
}

// 打开添加链接弹窗
const handleAddLink = () => {
  modalType.value = 'link'
  showModal.value = true
}

// 关闭弹窗
const handleCloseModal = () => {
  showModal.value = false
  modalType.value = null
}

// 提交新增节点
const handleSubmitNode = async (data: {
  name: string
  icon: string
  path?: string
  url?: string
}) => {
  if (window.desktopAPI) {
    const node: DesktopNode = {
      id: crypto.randomUUID(),
      type: modalType.value === 'app' ? 'app' : 'link',
      name: data.name,
      icon: data.icon,
      parentId: null,
      sortIndex: desktopItems.value.length,
      desktopId: DEFAULT_DESKTOP_ID,
      meta: {
        ...(data.path && { executablePath: data.path }),
        ...(data.url && { url: data.url })
      }
    }

    try {
      await window.desktopAPI.updateNode(node)
      desktopItems.value.push(node)
      MessageUtil.success(`成功添加${modalType.value === 'app' ? '应用' : '链接'}：${data.name}`)
    } catch (error) {
      console.error('Failed to add node:', error)
      MessageUtil.error('添加失败')
    }
  }
}

onMounted(() => {
  loadDesktopData()
})
</script>

<style lang="less" scoped>
.desktop-home {
  min-height: 100vh;
  background: var(--td-bg-color-page);
}
</style>

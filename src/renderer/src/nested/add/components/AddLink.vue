<template>
  <div class="m-8px">
    <t-card size="small">
      <t-form :data="data">
        <t-form-item label="名称" label-align="top">
          <t-input v-model="data.name" />
        </t-form-item>
        <t-form-item label="网站链接" label-align="top">
          <t-input v-model="data.url" @blur="fetchFavicon" />
        </t-form-item>
        <t-form-item label="网站图标" label-align="top" help="输入图标链接或留空自动生成">
          <t-input v-model="data.icon" />
        </t-form-item>
        <t-form-item label="打开方式" label-align="top">
          <t-radio-group v-model="data.openWith">
            <t-radio value="default">默认浏览器</t-radio>
            <t-radio value="inner">内置窗口</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-row v-if="data.openWith === 'inner'" :gutter="[16, 16]">
          <t-col :span="12">
            <t-form-item label="是否支持多开" label-align="top">
              <t-switch v-model="data.multi" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="宽" label-align="top">
              <t-input-number v-model="data.width" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="高" label-align="top">
              <t-input-number v-model="data.height" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="最小宽" label-align="top">
              <t-input-number v-model="data.minWidth" />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="最小高" label-align="top">
              <t-input-number v-model="data.minHeight" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="窗口样式" label-align="top">
              <t-select v-model="data.titleBarStyle">
                <t-option value="default" label="默认" />
                <t-option value="hidden" label="隐藏" />
                <t-option value="hiddenInset" label="隐藏凹口" />
                <t-option value="customButtonsOnHover" label="自定义按钮" />
              </t-select>
            </t-form-item>
          </t-col>
        </t-row>
        <div class="mt-16px">
          <t-form-item label-align="top">
            <t-space size="small">
              <t-button theme="primary" type="submit" @click="handleSubmit">{{
                isUpdate ? '保存' : '添加'
              }}</t-button>
              <t-button theme="default" variant="outline" type="reset">清空</t-button>
            </t-space>
          </t-form-item>
        </div>
      </t-form>
    </t-card>
  </div>
</template>
<script lang="ts" setup>
import { DesktopNode, DesktopNodeMeta } from '@common/types'
import { MessageUtil, useSnowflake } from '@/utils'

const params = new URLSearchParams(location.search)
const isUpdate = params.get('update') === '1'

if (isUpdate) {
  document.title = '更新链接'
}
const old = ref<DesktopNode>()
const data = ref<DesktopNodeMeta & { name: string; icon: string }>({
  name: '',
  url: '',
  icon: '',
  openWith: 'default',
  multi: true,
  minWidth: 800,
  minHeight: 600,
  width: 1200,
  height: 800
})
const fetchingIcon = ref(false)

const fetchFavicon = async () => {
  if (!data.value.url) return

  fetchingIcon.value = true
  try {
    // 尝试从 URL 提取域名
    let url = data.value.url.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const urlObj = new URL(url)

    data.value.icon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`

    // 如果 preload 提供了 API，尝试获取
    if (window.desktopAPI?.fetchFavicon) {
      const result = await window.desktopAPI.fetchFavicon(url)
      if (result.success) {
        data.value.icon = result.icon
      }
    }
  } catch {
    data.value.icon = ''
  } finally {
    fetchingIcon.value = false
  }
}

const handleSubmit = () => {
  let id: string
  if (isUpdate) {
    id = params.get('nodeId') || ''
  } else {
    id = useSnowflake().nextId()
  }
  const node: DesktopNode = {
    ...((old.value || {}) as DesktopNode),
    id: id,
    type: 'link',
    name: data.value.name,
    icon: data.value.icon,
    sortIndex: 0,
    column: 1,
    row: 1,
    meta: {
      url: data.value.url,
      openWith: data.value.openWith,
      width: data.value.width,
      height: data.value.height,
      minHeight: data.value.minHeight,
      minWidth: data.value.minWidth,
      titleBarStyle: data.value.titleBarStyle
    }
  }

  const parentId = params.get('parentId')
  const desktopId = params.get('desktopId')
  const x = params.get('x')
  const y = params.get('y')
  if (parentId) node.parentId = parentId
  else if (!old.value) node.parentId = null
  if (desktopId) node.desktopId = desktopId
  if (x) node.x = Number(x)
  if (y) node.y = Number(y)
  window.desktopAPI
    .updateNode(node)
    .then(() => {
      MessageUtil.success('成功添加链接')
    })
    .catch((e) => {
      MessageUtil.error('添加失败', e)
    })
}

onMounted(() => {
  if (isUpdate) {
    // 获取
    window.desktopAPI.getNode(params.get('nodeId') || '').then((res) => {
      if (!res) return
      old.value = res
      data.value = {
        ...res.meta,
        name: res.name,
        icon: res.icon
      }
    })
  }
})
</script>
<style scoped lang="less"></style>

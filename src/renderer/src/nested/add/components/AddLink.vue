<template>
  <t-form :data="data">
    <t-form-item label="名称" label-align="top">
      <Input v-model="data.name" />
    </t-form-item>
    <t-form-item label="网站链接" label-align="top">
      <Input v-model="data.url" @blur="fetchFavicon" />
    </t-form-item>
    <t-form-item label="网站图标" label-align="top" help="输入图标链接或留空自动生成">
      <Input v-model="data.icon" />
    </t-form-item>
    <t-form-item label="打开方式" label-align="top">
      <t-radio-group v-model="data.openWith">
        <t-radio value="default">默认浏览器</t-radio>
        <t-radio value="inner">内置窗口</t-radio>
      </t-radio-group>
    </t-form-item>
    <t-row v-if="data.openWith === 'inner'">
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
    </t-row>
    <t-form-item>
      <t-button theme="default" variant="outline" type="reset">清空</t-button>
      <t-button theme="primary" type="submit" @click="handleSubmit">保存</t-button>
    </t-form-item>
  </t-form>
</template>
<script lang="ts" setup>
import { DesktopNode } from '@common/types'
import { MessageUtil } from '@/utils'

const data = ref({
  name: '',
  url: '',
  icon: '',
  openWith: 'default' as 'default' | 'inner',
  width: undefined as number | undefined,
  height: undefined as number | undefined
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
  const params = new URLSearchParams(location.search)
  const node: DesktopNode = {
    id: crypto.randomUUID(),
    type: 'link',
    name: data.value.name,
    icon: data.value.icon,
    parentId: null,
    sortIndex: 0,
    desktopId: params.get('desktopId') || '',
    row: Number(params.get('row')),
    column: Number(params.get('column')),
    meta: {
      url: data.value.url,
      openWith: data.value.openWith,
      width: data.value.width,
      height: data.value.height
    }
  }
  window.desktopAPI
    .updateNode(node)
    .then(() => {
      MessageUtil.success('成功添加链接')
    })
    .catch((e) => {
      MessageUtil.error('添加失败', e)
    })
}
</script>
<style scoped lang="less"></style>

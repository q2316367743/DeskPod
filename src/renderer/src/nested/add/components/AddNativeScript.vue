<template>
  <div class="m-8px">
    <t-card size="small">
      <t-form :data="data">
        <t-form-item label="脚本名称" label-align="top">
          <t-input v-model="data.name" placeholder="输入脚本名称" />
        </t-form-item>
        <t-form-item label="脚本类型" label-align="top">
          <t-select v-model="data.source" :options="sourceOptions" placeholder="选择脚本类型" />
        </t-form-item>
        <t-form-item label="Shell路径" label-align="top">
          <n-file-select v-model="data.openWith" placeholder="或输入自定义Shell路径" label="选择" />
        </t-form-item>
        <t-form-item label="脚本内容" label-align="top">
          <MonacoEditor
            v-model="data.root"
            :language="language"
            height="200px"
            placeholder="输入要执行的命令..."
          />
        </t-form-item>
        <t-form-item label-align="top">
          <t-space size="small">
            <t-button theme="primary" type="submit" @click="handleSubmit">保存</t-button>
            <t-button theme="default" variant="outline" type="reset">清空</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>
<script lang="ts" setup>
import { useSnowflake } from '@common/utils'
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue'
import { CommonOption } from '@common/types'

const data = ref({
  name: '',
  source: '',
  root: '',
  openWith: ''
})

const isWindows = computed(() => window.supportAPI.isWindows())
const isMacOS = computed(() => window.supportAPI.isMacOS())
const isLinux = computed(() => window.supportAPI.isLinux())

const sourceOptions = computed(() => {
  const options: Array<CommonOption> = []
  if (isWindows.value) {
    options.push({ label: 'bat/cmd 脚本', value: 'cmd' })
    options.push({ label: 'PowerShell 脚本', value: 'ps1' })
  } else if (isMacOS.value) {
    options.push({ label: 'AppleScript', value: 'osascript' })
    options.push({ label: 'sh 脚本', value: 'zsh' })
  } else if (isLinux.value) {
    options.push({ label: 'sh 脚本', value: 'sh' })
  }
  // 公共的跨平台脚本
  options.push({ label: 'nodejs 脚本', value: 'nodejs' })
  options.push({ label: 'python 脚本', value: 'python' })
  options.push({ label: '自定义', value: 'custom' })
  return options
})
watch(
  () => data.value.source,
  (val) => {
    if (val === 'cmd') {
      data.value.openWith = 'cmd.exe'
    } else if (val === 'ps1') {
      data.value.openWith = 'powershell.exe'
    } else if (val === 'osascript') {
      data.value.openWith = 'osascript'
    } else if (val === 'sh') {
      data.value.openWith = '/bin/sh'
    } else if (val === 'zsh') {
      data.value.openWith = '/usr/bin/zsh'
    } else if (val === 'bash') {
      data.value.openWith = '/bin/bash'
    } else {
      data.value.openWith = ''
    }
  }
)

const language = computed(() => {
  switch (data.value.source) {
    case 'cmd':
      return 'bat'
    case 'ps1':
      return 'ps1'
    case 'osascript':
      return 'scpt'
    case 'sh':
      return 'sh'
    case 'nodejs':
      return 'javascript'
    case 'python':
      return 'python'
    default:
      return 'plaintext'
  }
})

const handleSubmit = () => {
  const params = new URLSearchParams(location.search)

  window.desktopAPI.updateNode({
    id: useSnowflake().nextId(),
    type: 'command',
    name: data.value.name || '本地命令',
    icon: 'icon:terminal',
    parentId: params.get('parentId') || null,
    sortIndex: 0,
    desktopId: params.get('desktopId') || '',
    x: Number(params.get('x')),
    y: Number(params.get('y')),
    column: 1,
    row: 1,
    meta: {
      // 脚本内容
      root: data.value.root,
      // 是哪个程序打开的
      openWith: data.value.openWith,
      // 作用：判断文本编辑器的语法高亮
      source: data.value.source
    }
  })
}

onMounted(() => {
  if (isWindows.value) {
    data.value.source = 'cmd'
  } else if (isMacOS.value) {
    data.value.source = 'zsh'
  } else if (isLinux.value) {
    data.value.source = 'sh'
  }
})
</script>
<style scoped lang="less"></style>

<template>
  <div class="m-8px">
    <t-card size="small">
      <t-form :data="data">
        <t-form-item label="命令名称" label-align="top">
          <t-input v-model="data.name" placeholder="输入命令名称" />
        </t-form-item>
        <t-form-item label="Shell程序" label-align="top">
          <t-select v-model="data.source" :options="sourceOptions" placeholder="选择Shell程序" />
        </t-form-item>
        <t-form-item label="自定义Shell路径" label-align="top">
          <n-file-select v-model="data.openWith" placeholder="自定义Shell路径" label="选择" />
        </t-form-item>
        <t-form-item label="命令内容" label-align="top">
          <MonacoEditor
            v-model="data.command"
            language="sh"
            height="200px"
            placeholder="输入要执行的命令..."
          />
        </t-form-item>
        <t-form-item label="执行目录" label-align="top">
          <n-file-select
            v-model="data.root"
            placeholder="请选择命令执行目录"
            directory
            label="选择"
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
  command: '',
  source: '',
  openWith: '',
  root: ''
})

const isWindows = computed(() => window.supportAPI.isWindows())
const isMacOS = computed(() => window.supportAPI.isMacOS())
const isLinux = computed(() => window.supportAPI.isLinux())

const sourceOptions = computed(() => {
  const options: Array<CommonOption> = []
  if (isWindows.value) {
    options.push({ label: 'cmd', value: 'cmd' })
    options.push({ label: 'PowerShell', value: 'ps1' })
  } else if (isMacOS.value) {
    options.push({ label: 'zsh', value: 'zsh' })
  } else if (isLinux.value) {
    options.push({ label: 'sh', value: 'sh' })
    options.push({ label: 'bash', value: 'bash' })
  }
  // 公共的跨平台脚本
  options.push({ label: 'nodejs 脚本', value: '}' })
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
      root: data.value.root,
      openWith: data.value.openWith,
      source: data.value.source,
      command: data.value.command
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

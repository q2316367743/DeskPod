<template>
  <div class="m-8px">
    <t-card size="small">
      <t-form :data="data">
        <t-form-item label="Shell程序" label-align="top">
          <t-select v-model="data.openWith" :options="shellOptions" placeholder="选择Shell程序" />
        </t-form-item>
        <t-form-item label="自定义Shell路径" label-align="top">
          <div class="flex gap-8px">
            <t-input v-model="data.customShell" placeholder="或输入自定义Shell路径" />
            <t-button variant="outline" @click="handleSelectShell">选择</t-button>
          </div>
        </t-form-item>
        <t-form-item label="命令内容" label-align="top">
          <MonacoEditor
            v-model="data.command"
            language="plaintext"
            height="200px"
            placeholder="输入要执行的命令..."
          />
        </t-form-item>
        <t-form-item label="命令名称" label-align="top">
          <t-input v-model="data.name" placeholder="输入命令名称" />
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

const data = ref({
  name: '',
  command: '',
  openWith: '',
  customShell: ''
})

const isWindows = computed(() => window.supportAPI.isWindows())
const isMacOS = computed(() => window.supportAPI.isMacOS())
const isLinux = computed(() => window.supportAPI.isLinux())

const shellOptions = computed(() => {
  const options: Array<{ label: string; value: string }> = []
  if (isWindows.value) {
    options.push({ label: 'cmd.exe', value: 'cmd.exe' })
    options.push({ label: 'PowerShell', value: 'powershell.exe' })
  } else if (isMacOS.value) {
    options.push({ label: 'zsh', value: '/bin/zsh' })
    options.push({ label: 'bash', value: '/bin/bash' })
    options.push({ label: 'sh', value: '/bin/sh' })
  } else if (isLinux.value) {
    options.push({ label: 'bash', value: '/bin/bash' })
    options.push({ label: 'sh', value: '/bin/sh' })
    options.push({ label: 'zsh', value: '/usr/bin/zsh' })
  }
  return options
})

watch(
  () => data.value.openWith,
  (val) => {
    if (val) data.value.customShell = val
  }
)

const handleSelectShell = () => {
  window.supportAPI.dialog
    .showOpenDialogSync({
      properties: ['openFile']
    })
    .then((result) => {
      if (result?.[0]) {
        data.value.customShell = result[0]
      }
    })
}

const handleSubmit = () => {
  const params = new URLSearchParams(location.search)
  const executor = data.value.customShell || data.value.openWith
  if (!executor) return

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
      root: data.value.command,
      openWith: executor
    }
  })
}
</script>
<style scoped lang="less"></style>

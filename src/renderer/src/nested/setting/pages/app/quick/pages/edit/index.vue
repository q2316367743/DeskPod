<template>
  <div class="edit">
    <header class="edit-header">
      <t-space size="small" class="edit-header__left">
        <t-button theme="primary" variant="text" shape="square" @click="handlerClick">
          <template #icon><chevron-left-icon /></template>
        </t-button>
        <div class="edit-header__title">编辑</div>
        <div class="ml-8px">
          <t-radio-group v-model="activeKey" variant="default-filled">
            <t-radio-button value="base">基础信息</t-radio-button>
            <t-radio-button value="html">HTML内容</t-radio-button>
          </t-radio-group>
        </div>
      </t-space>
      <div class="edit-header__right">
        <t-space size="small">
          <t-button
            v-if="activeKey === 'html'"
            theme="primary"
            :loading="previewing"
            @click="handleRunPreview"
          >
            <template #icon><PlayIcon /></template>
            运行预览
          </t-button>
          <t-button theme="primary" shape="square" @click="handleSave">
            <template #icon><save-icon /></template>
          </t-button>
        </t-space>
      </div>
    </header>

    <div class="edit-container">
      <div v-show="activeKey === 'base'" class="info-section">
        <div class="p-8px">
          <t-form ref="formRef" :data="formData" :rules="formRules">
            <t-form-item label="应用名称" name="name" label-align="top">
              <t-input v-model="formData.name" placeholder="请输入应用名称" />
            </t-form-item>
            <t-form-item label="图标" name="icon" label-align="top">
              <n-file-select
                v-model="formData.icon"
                placeholder="请选择图标文件"
                :filters="[
                  { name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg', 'webp'] }
                ]"
                label="选择图标"
              />
            </t-form-item>
            <t-form-item label="类型" name="type" label-align="top">
              <t-radio-group v-model="formData.type">
                <t-radio value="window">独立窗口</t-radio>
                <t-radio value="widget">小部件</t-radio>
              </t-radio-group>
            </t-form-item>
            <t-row :gutter="16" class="w-full overflow-hidden">
              <t-col :span="6">
                <t-form-item
                  label-align="top"
                  :label="formData.type === 'widget' ? '列' : '宽'"
                  name="width"
                >
                  <t-input-number v-model="formData.width" />
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item
                  label-align="top"
                  :label="formData.type === 'widget' ? '行' : '高'"
                  name="height"
                >
                  <t-input-number v-model="formData.height" />
                </t-form-item>
              </t-col>
            </t-row>
          </t-form>
        </div>
      </div>

      <div v-show="activeKey === 'html'" class="content-section">
        <div class="editor-container">
          <div class="monaco-editor-wrapper">
            <div ref="editorRef" class="monaco-editor"></div>
          </div>
        </div>
      </div>
    </div>
    <t-back-top container=".edit .edit-container" />
  </div>
</template>
<script lang="ts" setup>
import { FormInstanceFunctions, TdFormProps } from 'tdesign-vue-next'
import { ChevronLeftIcon, SaveIcon, PlayIcon } from 'tdesign-icons-vue-next'
import * as monaco from 'monaco-editor'
import { QuickAppCore } from '@common/types'
import { isDark } from '../../func/global'
import { MessageUtil } from '@/utils'
import { openCodeRunnerDrawer } from '../../components/CodeRunnerDrawer'
import NFileSelect from '@/components/native/NFileSelect.vue'

const route = useRoute()
const router = useRouter()

function handlerClick() {
  router.push('/app/quick')
}

const activeKey = ref('base')

const formData = ref<QuickAppCore>({
  name: '',
  description: '',
  icon: '',
  entry: '',
  from: 'ai',
  type: 'window',
  width: 800,
  height: 600,
  root: '',
  min_width: 800,
  min_height: 600
})

const formRules: TdFormProps['rules'] = {
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  root: [{ required: true, message: '请填写内容', trigger: 'blur' }]
}

const formRef = ref<FormInstanceFunctions>()
const editorRef = ref()
const saving = ref(false)
const previewing = ref(false)

let editor: monaco.editor.IStandaloneCodeEditor | null = null

watch(
  () => formData.value.type,
  (value) => {
    if (value === 'widget') {
      formData.value.width = 4
      formData.value.height = 2
      formData.value.min_width = 4
      formData.value.min_height = 2
    } else {
      formData.value.width = 800
      formData.value.height = 600
      formData.value.min_width = 800
      formData.value.min_height = 600
    }
  }
)

const initMonacoEditor = async () => {
  if (!editorRef.value) return

  editor = monaco.editor.create(editorRef.value, {
    value: formData.value.root,
    language: 'html',
    theme: isDark.value ? 'vs-dark' : 'vs-light',
    automaticLayout: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    wordWrap: 'on',
    folding: true,
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    glyphMargin: false,
    contextmenu: true,
    mouseWheelZoom: true,
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: 'full',
    tabSize: 2,
    insertSpaces: true
  })

  editor.onDidChangeModelContent(() => {
    formData.value.root = editor?.getValue() || ''
  })
}

const handleRunPreview = async () => {
  if (!formData.value.root.trim()) {
    MessageUtil.warning('请先输入HTML内容')
    return
  }
  openCodeRunnerDrawer(formData.value.root, {
    width: '80vw',
    title: '代码运行器',
    maskClosable: true,
    footer: false
  })
}

const handleSave = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    if (!formData.value.root.trim()) {
      MessageUtil.warning('请输入HTML内容')
      return
    }

    saving.value = true
    if (route.params.id === '0') {
      await window.quickAPI.install(formData.value)
    } else {
      await window.quickAPI.upgrade(route.params.id as string, formData.value)
    }
    MessageUtil.success('保存成功')
    await router.push('/app/quick')
  } catch (error) {
    MessageUtil.error('保存失败', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  initMonacoEditor()
  const { id } = route.params as { id: string }
  if (id !== '0') {
    Promise.all([window.quickAPI.getById(id), window.quickAPI.getHtml(id)]).then(([res, html]) => {
      formData.value = {
        ...res,
        icon: window.supportAPI.path.join(res.root, res.icon),
        root: html
      }
      editor?.setValue(html)
    })
  }
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>
<style scoped lang="less">
.edit {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--td-bg-color-container);

  .edit-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--td-border-level-2-color);
    height: 50px;
    box-sizing: border-box;

    &__left {
      display: flex;
      align-items: center;
      padding-left: 8px;
    }

    &__title {
      display: flex;
      align-items: center;
    }

    &__right {
      padding-right: 16px;
    }
  }

  .edit-container {
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
}

.info-section {
  margin-top: 16px;
  padding-bottom: 16px;
}

.content-section {
  .editor-container {
    display: flex;
    gap: 24px;
    height: calc(100vh - 51px);

    .monaco-editor-wrapper {
      flex: 1;
      overflow: hidden;

      .monaco-editor {
        height: 100%;
      }
    }
  }
}
</style>

<template>
  <div class="p-8px">
    <t-card>
      <!-- 新增模型 -->
      <t-card class="mb-16px" title="新增 AI 模型">
        <t-form :data="newModel" :rules="rules" label-width="100px" colon>
          <div class="flex gap-8px mb-16px">
            <t-select
              v-model="selectedProvider"
              class="w-200px"
              placeholder="选择 AI 提供商"
              @change="handleProviderChange"
            >
              <t-option
                v-for="provider in providers"
                :key="provider.value"
                :value="provider.value"
                :label="provider.label"
              />
            </t-select>
            <t-select
              v-model="newModel.modelId"
              class="flex-1"
              placeholder="选择模型"
              filterable
            >
              <t-option
                v-for="model in currentModels"
                :key="model.value"
                :value="model.value"
                :label="model.label"
              />
            </t-select>
          </div>
          <t-form-item label="模型名称" name="modelName">
            <t-input v-model="newModel.modelName" placeholder="自定义模型名称" class="w-400px" />
          </t-form-item>
          <t-form-item label="API 地址" name="apiOrigin">
            <t-input v-model="newModel.apiOrigin" placeholder="https://api.example.com" class="w-400px" />
          </t-form-item>
          <t-form-item label="API 密钥" name="apiKey">
            <t-input v-model="newModel.apiKey" type="password" placeholder="请输入 API 密钥" class="w-400px" />
          </t-form-item>
          <t-form-item>
            <t-button theme="primary" @click="handleAdd">添加模型</t-button>
          </t-form-item>
        </t-form>
      </t-card>

      <!-- 模型列表 -->
      <t-card title="已添加的模型">
        <t-table :data="models" row-key="id" :columns="columns" :pagination="false">
          <template #apiKey="{ row }">
            <span>{{ maskApiKey(row.apiKey) }}</span>
          </template>
          <template #op="slotProps">
            <t-button theme="danger" variant="text" @click="handleDelete(slotProps.row)">
              <template #icon><delete-icon /></template>
              删除
            </t-button>
          </template>
        </t-table>
        <div v-if="models.length === 0" class="flex flex-col items-center justify-center text-color-secondary py-32px">
          <robot-icon size="48px" class="mb-8px" />
          <span>暂无 AI 模型，请添加</span>
        </div>
      </t-card>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { DeleteIcon, RobotIcon } from 'tdesign-icons-vue-next'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import { AiModelSetting } from '@common/types'
import { useSnowflake } from '@common/utils'

interface Provider {
  label: string
  value: string
  models: Array<{ label: string; value: string }>
}

const providers: Provider[] = [
  {
    label: 'OpenAI',
    value: 'openai',
    models: [
      { label: 'GPT-4.1', value: 'gpt-4.1' },
      { label: 'GPT-4.1 Mini', value: 'gpt-4.1-mini' },
      { label: 'GPT-4.1 Nano', value: 'gpt-4.1-nano' },
      { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
      { label: '自定义模型', value: 'custom' }
    ]
  },
  {
    label: 'Claude (Anthropic)',
    value: 'claude',
    models: [
      { label: 'Claude Opus 4.1', value: 'claude-opus-4-1' },
      { label: 'Claude Sonnet 4.1', value: 'claude-sonnet-4-1' },
      { label: 'Claude Haiku 4.5', value: 'claude-haiku-4-5-20251001' },
      { label: 'Claude Opus 4', value: 'claude-opus-4-20250514' },
      { label: 'Claude Sonnet 4', value: 'claude-sonnet-4-20250514' },
      { label: 'Claude 3.5 Opus', value: 'claude-3-5-opus-20241022' },
      { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
      { label: 'Claude 3.5 Haiku', value: 'claude-3-5-haiku-20241022' },
      { label: '自定义模型', value: 'custom' }
    ]
  },
  {
    label: 'Gemini (Google)',
    value: 'gemini',
    models: [
      { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
      { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
      { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
      { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
      { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
      { label: '自定义模型', value: 'custom' }
    ]
  },
  {
    label: 'DeepSeek',
    value: 'deepseek',
    models: [
      { label: 'DeepSeek V3', value: 'deepseek-chat' },
      { label: 'DeepSeek R1', value: 'deepseek-reasoner' },
      { label: '自定义模型', value: 'custom' }
    ]
  },
  {
    label: 'KAT-Coder (快手)',
    value: 'kat-coder',
    models: [
      { label: 'KAT-Coder Pro', value: 'kat-coder-pro' },
      { label: 'KAT-Coder Pro-V2', value: 'kat-coder-pro-v2' },
      { label: '自定义模型', value: 'custom' }
    ]
  },
  {
    label: 'Qwen (阿里)',
    value: 'qwen',
    models: [
      { label: 'Qwen Max', value: 'qwen-max' },
      { label: 'Qwen Plus', value: 'qwen-plus' },
      { label: 'Qwen Turbo', value: 'qwen-turbo' },
      { label: 'Qwen Long', value: 'qwen-long' },
      { label: '自定义模型', value: 'custom' }
    ]
  },
  {
    label: 'Doubao (字节)',
    value: 'doubao',
    models: [
      { label: 'Doubao Pro 1.5', value: 'doubao-pro-1.5' },
      { label: 'Doubao Lite 1.5', value: 'doubao-lite-1.5' },
      { label: '自定义模型', value: 'custom' }
    ]
  }
]

const newModel = reactive<AiModelSetting>({
  id: '',
  modelId: '',
  modelName: '',
  apiOrigin: '',
  apiKey: ''
})

const selectedProvider = ref('')
const currentModels = ref<Array<{ label: string; value: string }>>([])
const models = ref<AiModelSetting[]>([])

const rules = {
  modelName: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  apiOrigin: [
    { required: true, message: '请输入 API 地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的 URL', trigger: 'blur' }
  ],
  apiKey: [{ required: true, message: '请输入 API 密钥', trigger: 'blur' }]
}

const columns = [
  { colKey: 'modelName', title: '模型名称', width: 160 },
  { colKey: 'modelId', title: '模型 ID', width: 160 },
  { colKey: 'apiOrigin', title: 'API 地址', width: 240 },
  { colKey: 'apiKey', title: 'API 密钥', width: 160 },
  { colKey: 'op', title: '操作', width: 80, fixed: 'right' }
]

onMounted(async () => {
  models.value = await window.settingAPI.listAiModel()
})

const handleProviderChange = (value: string) => {
  const provider = providers.find(p => p.value === value)
  if (provider) {
    currentModels.value = provider.models
    newModel.modelId = ''
  }
}

const handleAdd = async () => {
  if (!selectedProvider.value || !newModel.modelId) {
    MessagePlugin.warning('请选择 AI 提供商和模型')
    return
  }
  if (!newModel.modelName || !newModel.apiOrigin || !newModel.apiKey) {
    MessagePlugin.warning('请完整填写模型信息')
    return
  }

  const model: AiModelSetting = {
    id: useSnowflake().nextId(),
    modelId: newModel.modelId,
    modelName: newModel.modelName,
    apiOrigin: newModel.apiOrigin,
    apiKey: newModel.apiKey
  }

  await window.settingAPI.addAiModel(model)
  models.value = await window.settingAPI.listAiModel()

  // 重置表单
  newModel.modelName = ''
  newModel.apiOrigin = ''
  newModel.apiKey = ''
  newModel.modelId = ''
  selectedProvider.value = ''
  currentModels.value = []

  MessagePlugin.success('添加成功')
}

const handleDelete = (row: AiModelSetting) => {
  const modal = DialogPlugin.confirm({
    header: '确认删除',
    body: `确定要删除模型「${row.modelName}」吗？`,
    theme: 'warning',
    cancelBtn: '取消',
    confirmBtn: '确定',
    onConfirm: async () => {
      await window.settingAPI.deleteAiModel(row.id)
      models.value = await window.settingAPI.listAiModel()
      modal.close()
      MessagePlugin.success('删除成功')
    }
  })
}

const maskApiKey = (key: string) => {
  if (!key || key.length < 8) return '***'
  return `${key.slice(0, 4)}...${key.slice(-4)}`
}
</script>

<style scoped lang="less"></style>

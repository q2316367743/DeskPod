import { AiModelSetting } from '@common/types'
import { Col, DialogPlugin, Form, FormItem, Input, Row } from 'tdesign-vue-next'
import { MessageUtil } from '@/utils'

const rules = {
  modelName: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  apiOrigin: [
    { required: true, message: '请输入 API 地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的 URL', trigger: 'blur' }
  ],
  apiKey: [{ required: true, message: '请输入 API 密钥', trigger: 'blur' }]
}

export function openAddAiModelFunc(onUpdate: () => void) {
  const data = ref<AiModelSetting>({
    id: '',
    modelId: '',
    modelName: '',
    apiOrigin: '',
    apiKey: ''
  })
  const dp = DialogPlugin({
    header: '新增AI模型',
    width: '600px',
    confirmBtn: '添加',
    placement: 'center',
    onConfirm: async () => {
      if (!data.value.modelId || !data.value.modelName) {
        MessageUtil.warning('请选择 AI 提供商和模型')
        return
      }
      if (!data.value.modelName || !data.value.apiOrigin || !data.value.apiKey) {
        MessageUtil.warning('请完整填写模型信息')
        return
      }
      try {
        await window.settingAPI.addAiModel(toRaw(data.value))
        onUpdate()
        dp.destroy()
        MessageUtil.success('添加成功')
      } catch (e) {
        MessageUtil.error('添加失败', e)
      }
    },
    default: () => (
      <Form data={data.value} rules={rules as never} class={'w-full overflow-hidden'}>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem label={'模型 ID'} labelAlign={'top'} help={'例如：qwen-plus-latest'}>
              <Input v-model={data.value.modelId} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={'模型名称'} labelAlign={'top'} help={'例如：通义千问'}>
              <Input v-model={data.value.modelName} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label={'API 地址'}
              labelAlign={'top'}
              requiredMark={true}
              help={'必须使用与 OpenAI 兼容的 API 格式'}
            >
              <Input v-model={data.value.apiOrigin} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={'API 密钥'} labelAlign={'top'} requiredMark={true}>
              <Input v-model={data.value.apiKey} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  })
}

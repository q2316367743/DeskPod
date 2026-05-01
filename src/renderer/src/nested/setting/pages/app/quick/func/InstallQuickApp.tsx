import { QuickAppCore, QuickAppFrom } from '@common/types'
import {
  Col,
  DrawerPlugin,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Row,
  Textarea
} from 'tdesign-vue-next'
import NFileSelect from '@/components/native/NFileSelect.vue'
import { CloudDownloadIcon } from 'tdesign-icons-vue-next'
import { MessageUtil } from '@/utils'

export function openInstallQuickApp(from: QuickAppFrom, onUpdate: () => void) {
  const data = ref<QuickAppCore>({
    name: '',
    entry: '',
    icon: '',
    from: from,
    type: 'window',
    width: 800,
    height: 600,
    min_height: 600,
    min_width: 800,
    root: ''
  })

  const canInstall = computed(() => {
    if (!data.value.name) return false
    if (data.value.from === 'ai' || data.value.from === 'html') {
      return !!data.value.root
    }
    if (data.value.from === 'zip') {
      return !!data.value.entry && !!data.value.root
    }
    return false
  })

  watch(
    () => data.value.type,
    (value) => {
      if (value === 'widget') {
        data.value.width = 4
        data.value.height = 2
        data.value.min_width = 4
        data.value.min_height = 2
      } else {
        data.value.width = 800
        data.value.height = 600
        data.value.min_width = 800
        data.value.min_height = 600
      }
    }
  )

  const dp = DrawerPlugin({
    header: () => (
      <div class={'flex gap-8px items-center'}>
        <CloudDownloadIcon></CloudDownloadIcon>
        <div>安装快应用</div>
      </div>
    ),
    confirmBtn: '安装',
    size: '600px',
    onConfirm: async () => {
      if (!canInstall.value) {
        MessageUtil.error('请填写正确的信息')
        return
      }
      try {
        await window.quickAPI.install(toRaw(data.value))
        MessageUtil.success('快应用安装成功')
        dp.destroy?.()
        onUpdate()
      } catch (e) {
        MessageUtil.error('快应用安装失败', e)
      }
    },
    default: () => (
      <Form data={data.value}>
        <FormItem label={'应用名称'} labelAlign={'top'}>
          <Input v-model={data.value.name} placeholder="请输入应用名称" />
        </FormItem>
        {data.value.from === 'zip' && (
          <FormItem label={'ZIP 文件'} labelAlign={'top'}>
            <NFileSelect
              v-model={data.value.root}
              placeholder="请选择 ZIP 压缩包文件"
              filters={[{ name: 'ZIP 文件', extensions: ['zip'] }]}
              label="选择"
            />
          </FormItem>
        )}
        {data.value.from === 'zip' && (
          <FormItem label={'入口文件'} labelAlign={'top'} help={'相对于 ZIP 压缩包内的相对路径'}>
            <Input v-model={data.value.entry} placeholder="入口文件相对路径" />
          </FormItem>
        )}
        {data.value.from === 'ai' || data.value.from === 'html' ? (
          <FormItem label={'图标'} labelAlign={'top'}>
            <NFileSelect
              v-model={data.value.icon}
              placeholder="请选择图标文件"
              filters={[
                { name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg', 'webp'] }
              ]}
              label="选择图标"
            />
          </FormItem>
        ) : (
          <FormItem label={'图标'} labelAlign={'top'} help={'相对于 ZIP 压缩包内的相对路径'}>
            <Input v-model={data.value.icon} placeholder="图标相对路径" />
          </FormItem>
        )}
        {data.value.from === 'ai' && (
          <FormItem label={'HTML 内容'} labelAlign={'top'}>
            <Textarea v-model={data.value.root} autosize={{ minRows: 2, maxRows: 4 }} />
          </FormItem>
        )}
        {data.value.from === 'html' && (
          <FormItem label={'HTML 文件'} labelAlign={'top'}>
            <NFileSelect
              v-model={data.value.root}
              placeholder="请选择 HTML 文件"
              filters={[{ name: 'html文件', extensions: ['html', 'htm'] }]}
              label="选择 HTML 文件"
            />
          </FormItem>
        )}
        <FormItem label={'类型'} labelAlign={'top'}>
          <RadioGroup v-model={data.value.type}>
            <Radio value={'window'}>独立窗口</Radio>
            <Radio value={'widget'}>小部件</Radio>
          </RadioGroup>
        </FormItem>
        <Row gutter={16} class={'w-full overflow-hidden'}>
          <Col span={6}>
            <FormItem label={data.value.type === 'widget' ? '列' : '宽'} labelAlign={'top'}>
              <InputNumber v-model={data.value.width} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={data.value.type === 'widget' ? '行' : '高'} labelAlign={'top'}>
              <InputNumber v-model={data.value.height} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  })
}

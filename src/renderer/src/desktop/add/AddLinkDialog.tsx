import {
  DialogPlugin,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup
} from 'tdesign-vue-next'
import { DesktopNode } from '@common/types'
import { MessageUtil } from '@/utils'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'

export const openLinkAppDialog = (desktopId: string, column: number, row: number) => {
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

  const dp = DialogPlugin({
    header: '新增链接',
    closeOnEscKeydown: false,
    placement: 'center',
    onConfirm: () => {
      const node: DesktopNode = {
        id: crypto.randomUUID(),
        type: 'link',
        name: data.value.name,
        icon: data.value.icon,
        parentId: null,
        sortIndex: 0,
        desktopId: desktopId,
        row: row,
        column: column,
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
          useDesktopNodeStore().init()
          dp.destroy()
        })
        .catch((e) => {
          MessageUtil.error('添加失败', e)
        })
    },
    default: () => (
      <Form data={data.value}>
        <FormItem label={'名称'} labelAlign={'top'}>
          <Input v-model={data.value.name} />
        </FormItem>
        <FormItem label={'网站链接'} labelAlign={'top'}>
          <Input v-model={data.value.url} onBlur={fetchFavicon} />
        </FormItem>
        <FormItem label={'网站图标'} labelAlign={'top'} help={'输入图标链接或留空自动生成'}>
          <Input v-model={data.value.icon} />
        </FormItem>
        <FormItem label={'打开方式'} labelAlign={'top'}>
          <RadioGroup v-model={data.value.openWith}>
            <Radio value={'default'}>默认浏览器</Radio>
            <Radio value={'inner'}>内置窗口</Radio>
          </RadioGroup>
        </FormItem>
        {data.value.openWith === 'inner' && (
          <>
            <FormItem label={'宽'} labelAlign={'top'}>
              <InputNumber v-model={data.value.width} />
            </FormItem>
            <FormItem label={'高'} labelAlign={'top'}>
              <InputNumber v-model={data.value.height} />
            </FormItem>
          </>
        )}
      </Form>
    )
  })
}

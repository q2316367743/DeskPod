import { JSX } from 'vue/jsx-runtime'
import DialogComponent from './FdDialog.vue'
import { createVNode, render } from 'vue'

interface FdDialogProps {
  title?: string
  submitBtnText?: string
  onSubmit?: () => void
  icon?: () => JSX.Element
  default: () => JSX.Element
}

interface FdDialogMethod {
  show: () => void
  hide: () => void
  destroy: () => void
  setSubmitBtnDisabled: (res: boolean) => void
  setSubmitBtnLoading: (res: boolean) => void
}

export const createFdDialog = (options: FdDialogProps): FdDialogMethod => {
  const wrapper = document.createElement('div')
  const visible = ref(true)
  const submitBtnDisabled = ref(false)
  const submitBtnLoading = ref(false)

  function destroySelf() {
    render(null, wrapper)
    wrapper.remove()
  }

  const component = defineComponent({
    setup() {
      return () => {
        const onClose = () => {
          visible.value = false
          setTimeout(() => {
            destroySelf()
          }, 300)
        }
        return (
          <DialogComponent
            title={options.title}
            submitBtnText={options.submitBtnText}
            visible={visible.value}
            submitBtnDisabled={submitBtnDisabled.value}
            submitBtnLoading={submitBtnLoading.value}
            onSubmit={options.onSubmit}
            onClose={onClose}
          >
            {{
              icon: options.icon ? options.icon() : undefined,
              default: options.default ? options.default() : undefined
            }}
          </DialogComponent>
        )
      }
    }
  })
  const dialog = createVNode(component)

  const container = document.body
  if (container) {
    container.appendChild(wrapper)
  } else {
    console.error('attach is not exist')
  }

  render(dialog, wrapper)

  const dialogNode: FdDialogMethod = {
    show: () => {
      visible.value = true
    },
    hide: () => {
      visible.value = false
    },
    destroy: () => {
      visible.value = false
      setTimeout(() => {
        destroySelf()
      }, 300)
    },
    setSubmitBtnDisabled: (res) => {
      submitBtnDisabled.value = res
    },
    setSubmitBtnLoading: (res) => {
      submitBtnLoading.value = res
    }
  }
  return dialogNode
}

import { MessagePlugin } from 'tdesign-vue-next'

function render(message: string, e?: unknown) {
  if (e instanceof Error) {
    return e ? `${message}，${e.message}` : message
  } else {
    return e ? `${message}，${e}` : message
  }
}

function success(message: unknown): void
function success(message: unknown, callback: () => void): void
function success(message: unknown, callback?: () => void): void {
  MessagePlugin.success({
    closeBtn: true,
    content: typeof message === 'string' ? message : JSON.stringify(message),
    placement: 'bottom-right'
  })
  if (callback) {
    callback()
  }
}

function warning(message: string, e?: unknown): void {
  MessagePlugin.warning({
    closeBtn: true,
    content: render(message, e),
    placement: 'bottom-right'
  })
  console.error(message, e)
}

function error(message: string): void
function error(message: string, e: unknown): void
function error(message: string, e: unknown, callback: () => void): void
function error(message: string, e?: unknown, callback?: () => void): void {
  MessagePlugin.error({
    closeBtn: true,
    content: render(message, e),
    placement: 'bottom-right'
  })
  console.error(message, e)
  if (callback) {
    callback()
  }
}

export default {
  success,
  info(message: unknown) {
    MessagePlugin.info({
      closeBtn: true,
      content: typeof message === 'string' ? message : JSON.stringify(message),
      placement: 'bottom-right'
    })
  },
  warning,
  error
}

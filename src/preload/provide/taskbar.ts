import { ipcRenderer } from 'electron'
import { DeskPodEvent } from '@common/global'

interface TaskbarView {
  id: string
  name: string
  icon: string
  type: 'link' | 'quick' | 'plugin' | 'builtin'
  visible: boolean
}

export const taskbarAPI = {
  list: (): Promise<Array<TaskbarView>> => {
    return ipcRenderer.invoke('/main/taskbar/list')
  },
  toggle: (id: string) => {
    return ipcRenderer.invoke('/main/taskbar/toggle', id)
  },
  close: (id: string) => {
    return ipcRenderer.invoke('/main/taskbar/close', id)
  },
  onChange: (callback: () => void) => {
    ipcRenderer.on(DeskPodEvent.TASKBAR_CHANGED, callback)
    return () => {
      ipcRenderer.off(DeskPodEvent.TASKBAR_CHANGED, callback)
    }
  }
}

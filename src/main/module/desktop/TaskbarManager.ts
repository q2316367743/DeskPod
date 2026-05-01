import { BrowserWindow } from 'electron'
import { useSnowflake } from '@common/utils'
import { getMainWindow } from '$/module/desktop/MainWindow'
import { DeskPodEvent } from '@common/global'

interface TaskbarCore {
  name: string
  icon: string
  type: 'link' | 'quick' | 'plugin' | 'builtin'
}

interface TaskbarForm extends TaskbarCore {
  bw: BrowserWindow
}

interface TaskbarItem extends TaskbarCore {
  bw: BrowserWindow
  visible: boolean
}

interface TaskbarView extends TaskbarCore {
  id: string
  visible: boolean
}

export class TaskbarManager {
  private readonly map = new Map<string, TaskbarItem>()

  private onChange() {
    getMainWindow()?.webContents.send(DeskPodEvent.TASKBAR_CHANGED)
  }

  // 管理一个 bw
  manage(item: TaskbarForm) {
    const { bw } = item
    bw.setParentWindow(getMainWindow())
    const id = useSnowflake().nextId()
    this.map.set(id, { ...item, visible: true })
    // 监听关闭事件
    bw.on('close', () => {
      // 列表中删除
      this.map.delete(id)
      // 删除事件
      this.onChange()
    })
    // 监听最小化事件
    bw.on('minimize', () => {
      // 调用隐藏
      bw.hide()
    })
    bw.on('show', () => {
      const o = this.map.get(id)
      if (!o) return
      o.visible = true
      this.onChange()
    })
    bw.on('hide', () => {
      const o = this.map.get(id)
      if (!o) return
      o.visible = false
      o.bw.setSkipTaskbar(true)
      this.onChange()
    })
    // 新增事件
    this.onChange()
  }

  list() {
    const l = new Array<TaskbarView>()
    this.map.forEach((value, key) => {
      l.push({
        id: key,
        name: value.name,
        icon: value.icon,
        visible: value.visible,
        type: value.type
      })
    })
    return l
  }

  toggle(id: string) {
    const o = this.map.get(id)
    if (o) {
      if (o.bw.isVisible()) {
        o.bw.hide()
        o.visible = false
      } else {
        o.bw.show()
        o.bw.focus()
        o.visible = true
      }
      this.onChange()
    }
  }
  close(id: string) {
    const o = this.map.get(id)
    if (o) {
      o.bw.close()
      this.onChange()
    }
  }
}

import { join } from 'node:path'
import { BaseDirectory, getDirectory } from '$/support/plugin-path'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { useSnowflake } from '@common/utils'
import { getPluginWindowByKey } from '$/module/plugin'
import { ApiPayload } from '$/global/DefineApi'

type ReloadOptions = {
  /**
   * 为了完全匹配存储与磁盘上的状态，忽略默认值
   */
  ignoreDefaults?: boolean
}
export type StoreOptions = {
  /**
   * 存储的默认值
   */
  defaults: {
    [key: string]: unknown
  }
  /**
   * 自动保存修改时，去弹时间以毫秒计，默认是100毫秒，输入“false”以禁用
   */
  autoSave?: boolean | number
  /**
   * 强制创建一个默认值的新存储，即使它已经存在。
   */
  createNew?: boolean
  /**
   * 创建存储时，如果存在则用磁盘状态覆盖，默认值
   */
  overrideDefaults?: boolean
}

interface StoreValue {
  // 用户传递的相对目录
  path: string
  // 实际的目录
  target: string
  // 参数
  options?: StoreOptions | null
  // 存储的数据
  store: Record<string, unknown>
}

export class StoreManager {
  private readonly map = new Map<string, StoreValue>()

  async load(path: string, pluginId: string, options?: StoreOptions) {
    const target = join(getDirectory(pluginId, BaseDirectory.AppData), path)
    // 尝试读取
    const has = existsSync(target)
    const key = `${pluginId}-${useSnowflake().nextId()}`
    if (has) {
      // 读取文件
      try {
        if (options) {
          if (options.createNew) {
            // 强制创建新的
            this.map.set(key, { path, options, target, store: options.defaults })
            return key
          }
        }
        const text = await readFile(target, 'utf-8')
        const store = JSON.parse(text)
        this.map.set(key, { path, options, target, store })
      } catch (e) {
        console.error(e)
      }
    }
    this.map.set(key, { target, options, path, store: {} })
    return key
  }

  async getStore(path: string) {
    for (const [key, value] of this.map.entries()) {
      if (value.path === path) {
        return key
      }
    }
    return undefined
  }

  async setValue(rid: string, key: string, value: unknown, payload: ApiPayload) {
    const s = this.map.get(rid)
    if (s) {
      const old = s.store[key]
      s.store[key] = value
      if (old !== value) {
        const bw = getPluginWindowByKey(payload.pluginId, payload.label)
        if (bw) {
          bw.window.webContents.send('store://change', {
            payload: {
              resourceId: rid,
              key: key,
              value: value,
              exists: true
            }
          })
        }
      }
      if (s.options?.autoSave) {
        await this.save(rid)
      }
    }
  }

  getValue(rid: string, key: string) {
    const s = this.map.get(rid)
    if (s) {
      return s.store[key]
    }
    return undefined
  }

  hasKey(rid: string, key: string) {
    const s = this.map.get(rid)
    if (s) {
      return key in s.store
    }
    return false
  }
  async deleteKey(rid: string, key: string, payload: ApiPayload) {
    const s = this.map.get(rid)
    if (s) {
      delete s.store[key]
      const bw = getPluginWindowByKey(payload.pluginId, payload.label)
      if (bw) {
        bw.window.webContents.send('store://change', {
          payload: {
            resourceId: rid,
            key: key,
            exists: false
          }
        })
      }
      if (s.options?.autoSave) {
        await this.save(rid)
      }
      return true
    }
    return false
  }

  clear(rid: string, payload: ApiPayload) {
    const s = this.map.get(rid)
    if (s) {
      const keys = Object.keys(s.store)
      for (const key of keys) {
        this.deleteKey(rid, key, payload)
      }
    }
  }
  reset(rid: string, payload: ApiPayload) {
    const s = this.map.get(rid)
    if (s) {
      if (!s.options) {
        return this.clear(rid, payload)
      }
      s.store = {}
      Object.entries(s.options.defaults).map(([key, value]) => {
        this.setValue(rid, key, value, payload)
      })
    }
  }

  keys(rid: string) {
    const s = this.map.get(rid)
    if (s) {
      return Object.keys(s.store)
    }
    return []
  }

  values(rid: string) {
    const s = this.map.get(rid)
    if (s) {
      return Object.values(s.store)
    }
    return []
  }

  entries(rid: string) {
    const s = this.map.get(rid)
    if (s) {
      return Object.entries(s.store)
    }
    return []
  }

  length(rid: string) {
    const s = this.map.get(rid)
    if (s) {
      return Object.keys(s.store).length
    }
    return 0
  }

  async reload(rid: string, options?: ReloadOptions) {
    const s = this.map.get(rid)
    if (s) {
      const ignoreDefaults = Boolean(options?.ignoreDefaults)
      const text = await readFile(s.target, 'utf-8')
      const store = JSON.parse(text)
      if (ignoreDefaults) {
        s.store = store
      } else {
        s.store = { ...s.options?.defaults, ...store }
      }
    }
  }

  async save(rid: string) {
    const s = this.map.get(rid)
    if (s) {
      await writeFile(s.path, JSON.stringify(s.store), 'utf-8')
      return true
    }
    return false
  }

  close(rid: string) {
    const s = this.map.get(rid)
    if (s) {
      this.map.delete(rid)
    }
  }

  closeAllPlugin(pluginId: string) {
    const keys = Array.from(this.map.keys())
    for (const key of keys) {
      if (key.startsWith(`${pluginId}-`)) {
        this.map.delete(key)
      }
    }
  }
}

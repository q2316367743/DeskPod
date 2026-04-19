import { AiModelSetting, defaultSetting, Setting } from '@common/types'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { APP_DATA_DB_DIR } from '$/global/Constant'

export class SettingManager {
  private defaultValue = defaultSetting()
  private setting = defaultSetting()
  private readonly path = join(APP_DATA_DB_DIR, 'setting.json')
  async init() {
    if (existsSync(this.path)) {
      const raw = await readFile(this.path, 'utf-8')
      this.setting = JSON.parse(raw)
    }
  }
  all() {
    return this.setting
  }
  get<K extends keyof Setting>(key: K) {
    return this.setting[key] || this.defaultValue[key]
  }
  async set<K extends keyof Setting>(key: K, value: Setting[K]) {
    this.setting[key] = value
    await writeFile(this.path, JSON.stringify(this.setting, null, 2))
  }
  listAiModel() {
    return this.setting.models
  }
  async addAiModel(model: AiModelSetting) {
    this.setting.models.push(model)
    await writeFile(this.path, JSON.stringify(this.setting, null, 2))
  }
  async deleteAiModel(id: string) {
    this.setting.models = this.setting.models.filter((model) => model.id !== id)
    await writeFile(this.path, JSON.stringify(this.setting, null, 2))
  }
}

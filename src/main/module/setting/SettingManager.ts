import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { APP_DATA_ASSET_DIR, APP_DATA_DB_DIR } from '$/global/Constant'
import { getMainWindow } from '$/module/desktop'
import { useSnowflake } from '@common/utils'
import { SYSTEM_EVENT } from '@common/global'
import { AiModelSetting, defaultSetting, Setting } from '@common/types'

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
    getMainWindow()?.webContents.send(SYSTEM_EVENT.SETTING_CHANGE, key, value)
    return true
  }

  // --------------------------- AI Model ---------------------------

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

  // --------------------------- 背景图片 ---------------------------

  async listBgImage(theme: 'light' | 'dark') {
    const folder = join(APP_DATA_ASSET_DIR, 'background', theme)
    if (existsSync(folder)) {
      const files = await readdir(folder)
      return files.map((file) => join(folder, file))
    }
    return []
  }
  async uploadBgImage(theme: 'light' | 'dark', path: string) {
    const folder = join(APP_DATA_ASSET_DIR, 'background', theme)
    if (!existsSync(folder)) {
      await mkdir(folder, { recursive: true })
    }
    const ext = extname(path)
    const name = useSnowflake().nextId()
    const target = join(folder, `${name}${ext}`)
    // 复制
    await copyFile(path, target)
  }
  async deleteBgImage(path: string) {
    // 删除
    await unlink(path)
  }
}

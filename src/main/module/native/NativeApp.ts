import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { platform } from 'node:os'
import { createHash } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { getMacInstalledApps, getWinInstalledApps } from 'get-installed-apps'
import { fileIconToBuffer } from 'file-icon'
import { APP_DATA_ASSET_ICON_DIR } from '$/global/Constant'

// 确保缓存目录存在
if (!existsSync(APP_DATA_ASSET_ICON_DIR)) {
  mkdirSync(APP_DATA_ASSET_ICON_DIR, { recursive: true })
}

// 生成缓存文件名
function getCachePath(appPath: string) {
  const hash = createHash('md5').update(appPath).digest('hex')
  return join(APP_DATA_ASSET_ICON_DIR, `${hash}.png`)
}

async function getIconPath(appPath: string): Promise<string> {
  try {
    // 2. 检查缓存
    const cacheFile = getCachePath(appPath)
    if (existsSync(cacheFile)) {
      // 命中缓存：直接以流的形式返回本地文件，性能最高！
      return cacheFile
    }

    // 3. 未命中缓存：提取图标
    // 获取 64x64 分辨率的图标 Buffer
    const iconBuffer = await fileIconToBuffer(appPath, { size: 64 })

    // 4. 写入缓存（异步写入即可，不阻塞返回）
    await writeFile(cacheFile, iconBuffer)

    // 5. 返回图标数据
    return cacheFile
  } catch (err) {
    console.error('获取图标失败:', err)
    // 返回一个默认的占位图 (建议在项目里放一个 default-icon.png)
    return ''
  }
}

export async function listApps() {
  const p = platform()
  let res: Array<{ id: string; name: string; path: string }>
  if (p === 'win32') {
    const apps = (await getWinInstalledApps()) as Array<Record<string, string>>
    res = apps.map((app) => ({
      id: app.appIdentifier,
      name: app.appName || app.DisplayName,
      path: app.InstallLocation || app.ExecutablePath
    }))
  } else if (p === 'darwin') {
    const apps = (await getMacInstalledApps()) as Array<Record<string, string>>
    console.log(apps)
    res = apps.map((app) => {
      const appName = app.appName || app.kMDItemDisplayName
      return {
        id: app.appIdentifier,
        name: appName.replace(/\.app$/, ''),
        path: `/Applications/${appName}`
      }
    })
  } else {
    res = []
  }
  const items = new Array<{ id: string; name: string; path: string; icon: string }>()
  for (const re of res) {
    const icon = await getIconPath(re.id)
    items.push({
      ...re,
      icon: pathToFileURL(icon).href
    })
  }
  return items
}

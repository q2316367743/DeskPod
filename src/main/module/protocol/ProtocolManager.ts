import { protocol, net } from 'electron'
import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { createHash } from 'node:crypto'
import { fileIconToBuffer } from 'file-icon'
import { APP_ID } from '@common/global'

// 协议管理器
// 缓存目录路径
const CACHE_DIR = join(tmpdir(), APP_ID)

// 确保缓存目录存在
if (!existsSync(CACHE_DIR)) {
  mkdirSync(CACHE_DIR, { recursive: true })
}

// 生成缓存文件名
function getCachePath(appPath: string) {
  const hash = createHash('md5').update(appPath).digest('hex')
  return join(CACHE_DIR, `${hash}.png`)
}

async function handleIconRequest(url: URL) {
  console.log('处理图标请求:', url.pathname)
  try {
    const appPath = decodeURIComponent(url.pathname)

    // 2. 检查缓存
    const cacheFile = getCachePath(appPath)
    if (existsSync(cacheFile)) {
      // 命中缓存：直接以流的形式返回本地文件，性能最高！
      return net.fetch(`file://${cacheFile}`)
    }

    // 3. 未命中缓存：提取图标
    // 获取 64x64 分辨率的图标 Buffer
    const iconBuffer = await fileIconToBuffer(appPath, { size: 64 })

    // 4. 写入缓存（异步写入即可，不阻塞返回）
    writeFile(cacheFile, iconBuffer).catch((err) => {
      console.error('写入图标缓存失败:', err)
    })

    // 5. 返回图标数据
    return new Response(Buffer.from(iconBuffer), {
      headers: { 'Content-Type': 'image/png' }
    })
  } catch (err) {
    console.error('获取图标失败:', err)
    // 返回一个默认的占位图 (建议在项目里放一个 default-icon.png)
    return net.fetch(`file://${join(__dirname, 'assets/default-icon.png')}`)
  }
}

// 处理 deskpod:// 请求的核心逻辑
async function handleRequest(request: GlobalRequest): Promise<GlobalResponse> {
  // URL 格式例如: deskpod://icon/Applications/Safari.app
  console.log('handleRequest', request.url)
  const url = new URL(request.url)
  if (url.host === 'icon') {
    return handleIconRequest(url)
  }

  return new Response(
    JSON.stringify({
      message: 'Not found',
      status: 404
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

// 注册协议
export function registerProtocol() {
  protocol.handle('desktop', handleRequest)
}

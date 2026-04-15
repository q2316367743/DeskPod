import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { defineApi } from '$/types/DefineApi'

interface BaseArgs {
  path: string
}

interface Base1Args {
  path: string
  options: Record<string, unknown>
}

interface MkdirArgs {
  path: string
  options: { recursive: boolean; mode?: number }
}

interface BaseOptions {
  headers: { path: string; options: Record<string, unknown> }
}

interface FileInfo {
  isFile: boolean
  isDirectory: boolean
  isSymlink: boolean
  size: number
  mtime: Date | null
  atime: Date | null
  birthtime: Date | null
  readonly: boolean
  fileAttributes: number | null
  dev: number | null
  ino: number | null
  mode: number | null
  nlink: number | null
  uid: number | null
  gid: number | null
  rdev: number | null
  blksize: number | null
  blocks: number | null
}

interface DirEntry {
  name: string
  isDirectory: boolean
  isFile: boolean
  isSymlink: boolean
}

interface WriteOptions {
  headers: { path: string; options: string }
}

/**
 * 读取文件并返回 ArrayBuffer
 * @param filePath - 文件路径
 */
async function readFileAsArrayBuffer(filePath: string): Promise<ArrayBuffer> {
  const buffer = await fs.readFile(filePath)
  // Buffer 可以直接通过 .buffer 属性获取 ArrayBuffer
  // 注意：需处理 Buffer 的偏移和长度（避免共享底层内存问题）
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

export default [
  defineApi<BaseArgs>('plugin:fs|read_text_file', async (args) => {
    const { path } = args as BaseArgs
    return await readFileAsArrayBuffer(Array.isArray(path) ? path[0] : path)
  }),
  defineApi<Uint8Array | ArrayLike<number>, BaseOptions>(
    'plugin:fs|write_text_file',
    async (args, options) => {
      return await fs.writeFile(
        decodeURIComponent(options.headers.path),
        Buffer.from(args instanceof Uint8Array ? args : new Uint8Array(args)),
        {
          encoding: 'utf-8'
        }
      )
    }
  ),
  defineApi<BaseArgs>('plugin:fs|read_dir', async (args) => {
    const { path } = args
    const items = await fs.readdir(path)
    const entries = new Array<DirEntry>()
    const res = await Promise.all(
      items.map(async (item) => {
        const stats = await fs.stat(join(path, item))
        return { item, stats }
      })
    )

    for (const { item, stats } of res) {
      entries.push({
        name: item,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        isSymlink: stats.isSymbolicLink()
      })
    }
    return entries
  }),
  defineApi<MkdirArgs>('plugin:fs|mkdir', async (args) => {
    const { path, options } = args
    return await fs.mkdir(path, {
      recursive: options.recursive,
      mode: options.mode
    })
  }),
  defineApi<BaseArgs>('plugin:fs|exists', async (args) => {
    const { path } = args
    return existsSync(path)
  }),
  defineApi<BaseArgs>('plugin:fs|remove', async (args) => {
    const { path } = args
    await fs.unlink(path)
  }),
  defineApi<{ oldPath: string; newPath: string }>('plugin:fs|rename', async (args) => {
    const { oldPath, newPath } = args
    await fs.rename(oldPath, newPath)
  }),
  defineApi<Base1Args, unknown, FileInfo>('plugin:fs|stat', async (args) => {
    const { path, options } = args
    const stats = await fs.stat(path, options)
    return {
      name: basename(path),
      mtime: stats.mtime,
      atime: stats.atime,
      birthtime: stats.birthtime,
      readonly: stats.mode === 0o200,
      fileAttributes: stats.mode,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      isSymlink: stats.isSymbolicLink(),
      size: stats.size,
      dev: stats.dev,
      ino: stats.ino,
      mode: stats.mode,
      nlink: stats.nlink,
      uid: stats.uid,
      gid: stats.gid,
      rdev: stats.rdev,
      blksize: stats.blksize,
      blocks: stats.blocks
    }
  }),
  defineApi<Uint8Array | ArrayLike<number>, WriteOptions>(
    "'plugin:fs|write_file'",
    async (args, options) => {
      const { headers } = options
      const { path } = headers
      let createNew = false
      let mode = undefined
      if (headers.options) {
        try {
          const o = JSON.parse(headers.options)
          createNew = o.createNew
          mode = o.mode
        } catch (e) {
          console.error(e)
        }
      }
      const p = decodeURIComponent(path)
      if (createNew) {
        if (existsSync(p)) {
          // 删除
          await fs.unlink(p)
        }
      }
      await fs.writeFile(p, Buffer.from(args instanceof Uint8Array ? args : new Uint8Array(args)), {
        mode: mode,
        encoding: 'binary'
      })
    }
  )
]

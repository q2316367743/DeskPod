import { platform, tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { DesktopNode } from '@common/types'

const getExecutor = (node: DesktopNode) => {
  const openWith = node.meta?.openWith
  if (openWith) return openWith
  switch (platform()) {
    case 'win32':
      return 'cmd.exe'
    case 'darwin':
      return '/bin/zsh'
    case 'linux':
      return '/bin/bash'
    default:
      throw new Error('Unsupported platform')
  }
}

const openInTerminal = (executor: string, args: string[], cwd?: string) => {
  const currentPlatform = platform()
  if (currentPlatform === 'darwin') {
    const fullCommand = `cd "${cwd || '~'}" && ${executor} ${args.map((a) => `'${a}'`).join(' ')}`
    const script = `tell application "Terminal" to do script "${fullCommand.replace(/"/g, '\\"')}"`
    spawn('osascript', ['-e', script], { detached: true, stdio: 'ignore' })
  } else if (currentPlatform === 'win32') {
    const fullCommand = `${executor} ${args.join(' ')}`
    spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', fullCommand], {
      detached: true,
      stdio: 'ignore',
      cwd
    })
  } else {
    const fullCommand = `${executor} ${args.join(' ')}`
    spawn('gnome-terminal', ['--', 'bash', '-c', `${fullCommand}; exec bash`], {
      detached: true,
      stdio: 'ignore',
      cwd
    })
  }
}

export const openCommandApp = async (node: DesktopNode): Promise<boolean> => {
  const command = node.meta?.command
  if (!command) return false
  const executor = getExecutor(node)
  const cwd = node.meta?.root || undefined
  let args: string[]
  if (executor === 'cmd.exe') {
    args = ['/c', command]
  } else if (executor === 'powershell.exe') {
    args = ['-Command', command]
  } else if (executor === 'osascript') {
    args = ['-e', command]
  } else if (executor === 'node') {
    args = ['-e', command]
  } else if (executor === 'python') {
    args = ['-c', command]
  } else {
    args = ['-c', command]
  }
  openInTerminal(executor, args, cwd)
  return true
}

const getScriptExtension = (source: string): string => {
  switch (source) {
    case 'cmd':
      return '.bat'
    case 'ps1':
      return '.ps1'
    case 'osascript':
      return '.scpt'
    case 'zsh':
      return '.zsh'
    case 'sh':
      return '.sh'
    case 'bash':
      return '.bash'
    case 'nodejs':
      return '.js'
    case 'python':
      return '.py'
    default:
      return '.sh'
  }
}

export const openScriptApp = async (node: DesktopNode): Promise<boolean> => {
  const scriptContent = node.meta?.command
  if (!scriptContent) return false
  const executor = getExecutor(node)
  const source = node.meta?.source || ''
  const ext = getScriptExtension(source)
  const tempDir = mkdtempSync(join(tmpdir(), 'deskpod-'))
  const scriptPath = join(tempDir, `script${ext}`)
  writeFileSync(scriptPath, scriptContent, 'utf-8')
  let args: string[]
  if (executor === 'cmd.exe') {
    args = ['/c', scriptPath]
  } else if (executor === 'powershell.exe') {
    args = ['-File', scriptPath]
  } else {
    args = [scriptPath]
  }
  openInTerminal(executor, args)
  return true
}

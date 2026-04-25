import { platform } from 'node:os'
import { spawn } from 'node:child_process'
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

export const openCommandApp = async (node: DesktopNode): Promise<boolean> => {
  const command = node.meta?.root
  if (!command) return false
  const executor = getExecutor(node)
  const args = executor === 'cmd.exe' ? ['/c', command] : ['-c', command]
  spawn(executor, args, { detached: true, stdio: 'ignore' })
  return true
}

export const openScriptApp = async (node: DesktopNode): Promise<boolean> => {
  const scriptPath = node.meta?.root
  if (!scriptPath) return false
  const executor = getExecutor(node)
  spawn(executor, [scriptPath], { detached: true, stdio: 'ignore' })
  return true
}

import { defineApi } from '$/global/DefineApi'
import { spawn } from 'node:child_process'

const programMap = {
  'xattr-d-apple': 'xattr'
}

interface ExecuteArgs {
  program: string
  args: string[]
  options: {
    sidecar: boolean
    cwd?: string
    env?: Record<string, string>
    encoding?: string
  }
}

export default [
  defineApi<ExecuteArgs>('plugin:shell|execute', async (args) => {
    const { program, args: cmdArgs, options } = args

    if (options && options.sidecar) {
      // sidecar 程序
    }

    const r = spawn(programMap[program], cmdArgs, options)
    return new Promise((resolve, reject) => {
      let stdout = ''
      let stderr = ''

      r.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      r.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      r.on('close', (code) => {
        resolve({ code, signal: null, stdout, stderr })
      })

      r.on('error', (error) => {
        reject({ error: error.message, stdout, stderr })
      })
    })
  })
]

import log from 'electron-log/main'

// 1. 初始化日志系统（v5 必须调用）
log.initialize()

// 2. 配置日志格式（可选）
// 默认格式可能有点长，你可以自定义
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'

// 3. 配置日志文件大小和数量（可选）
// 超过 5MB 就切割，最多保留 5 个旧文件
log.transports.file.maxSize = 5 * 1024 * 1024
// log.transports.file.archiveLog = (file) => file.replace(/\.log$/, `-${new Date().toISOString().replace(/[:.]/g, '-')}.log`)

// 4. 捕获未处理的异常（非常关键，避免程序静默崩溃）
log.errorHandler.startCatching()

export function logDebug(message: string, ...args: unknown[]): void {
  log.debug(message, ...args)
}

export function logInfo(message: string, ...args: unknown[]): void {
  log.info(message, ...args)
}

export function logError(message: string, ...args: unknown[]): void {
  log.error(message, ...args)
}

export function logWarning(message: string, ...args: unknown[]): void {
  log.warn(message, ...args)
}

export function logDebug(message: string, ...args: unknown[]): void {
  window.logAPI.debug(message, ...args)
}

export function logInfo(message: string, ...args: unknown[]): void {
  window.logAPI.info(message, ...args)
}

export function logWarning(message: string, ...args: unknown[]): void {
  window.logAPI.warn(message, ...args)
}

export function logError(message: string, ...args: unknown[]): void {
  window.logAPI.error(message, ...args)
}

export function logProgress(progress: number, total: number, message: string): void {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0
  const progressMessage = `[${percentage}%] ${message} (${progress}/${total})`
  window.logAPI.info(progressMessage)
}

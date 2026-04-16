

export function logDebug(message: string, ...args: unknown[]): void {
  console.debug(message, ...args)
}

export function logInfo(message: string, ...args: unknown[]): void {
  console.info(message, ...args)
}

export function logError(message: string, ...args: unknown[]): void {
  console.error(message, ...args)
}

export function logTrace(message: string, ...args: unknown[]): void {
  console.trace(message, ...args)
}

export function logWarning(message: string, ...args: unknown[]): void {
  console.warn(message, ...args)
}

export function logFatal(message: string, ...args: unknown[]): void {
  console.error(message, ...args)
}

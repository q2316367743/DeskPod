export class Result<T> {
  readonly ok: boolean
  readonly status: number
  readonly message: string
  readonly data: T | undefined

  private constructor(ok: boolean, status: number, message: string, data?: T) {
    this.ok = ok
    this.status = status
    this.message = message
    this.data = data
  }

  public static ok<T>(data?: T) {
    return new Result<T>(true, 0, '成功', data)
  }

  public static error(message: string, status = 1) {
    return new Result<never>(false, status, message)
  }
}

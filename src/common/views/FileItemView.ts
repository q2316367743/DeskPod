export interface FileItemView {
  name: string
  path: string
  isDirectory: boolean
  isFile: boolean
  size: number
  birthtime: Date
  mtime: Date
}

import { ipcRenderer } from 'electron'

export const dbAPI = {
  lmdb: {
    main: {
      keys: () => ipcRenderer.invoke('/app/db/main/keys'),
      value: (key: string) => ipcRenderer.invoke('/app/db/main/value', key),
      put: (key: string, value: unknown) => ipcRenderer.invoke('/app/db/main/put', key, value),
      delete: (key: string) => ipcRenderer.invoke('/app/db/main/delete', key)
    }
  }
}

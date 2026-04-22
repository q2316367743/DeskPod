import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { DesktopNode } from '@common/types'
import { group } from '@common/utils'
import { BUILTIN_KEY, SYSTEM_EVENT } from '@common/global'
import { APP_DATA_DB_DIR } from '$/global/Constant'
import { getMainWindow } from '$/module/desktop'
import { closeBuiltinWindow } from '$/module/desktop/BuiltinWindow'

interface DesktopItem {
  id: string
  name: string
}

interface DesktopData {
  nodes: Array<DesktopNode>
  desktops: Array<DesktopItem>
}

export class DesktopManager {
  private nodes = new Array<DesktopNode>()
  private desktops = new Array<DesktopItem>()
  private map = new Map<string, Array<DesktopNode>>()
  private readonly path = join(APP_DATA_DB_DIR, 'desktop_data.json')

  async init() {
    if (existsSync(this.path)) {
      const raw = await readFile(this.path, 'utf-8')
      const data = JSON.parse(raw) as DesktopData
      this.nodes = data.nodes || []
      this.desktops = data.desktops || []
      this.map = group(this.nodes, 'desktopId')
    }
  }

  private async save() {
    await writeFile(
      this.path,
      JSON.stringify(
        {
          nodes: this.nodes,
          desktops: this.desktops
        },
        null,
        2
      ),
      'utf-8'
    )
    // 更新 map
    this.map = group(this.nodes, 'desktopId')
    getMainWindow()?.webContents.send(SYSTEM_EVENT.DESKTOP_CHANGE)
  }

  list(desktopId: string) {
    return this.map.get(desktopId) || []
  }

  getNode(nodeId: string) {
    return this.nodes.find((e) => e.id === nodeId)
  }

  async updateNode(node: DesktopNode) {
    const index = this.nodes.findIndex((n) => n.id === node.id)

    if (index >= 0) {
      // 更新现有节点
      this.nodes[index] = { ...this.nodes[index], ...node }
    } else {
      // 新增节点
      this.nodes.push(node)
    }

    await this.save()
    await closeBuiltinWindow(BUILTIN_KEY.ADD)
    return node
  }

  async updateNodes(nodes: DesktopNode[]) {
    for (const newNode of nodes) {
      const index = this.nodes.findIndex((n) => n.id === newNode.id)
      if (index >= 0) {
        this.nodes[index] = { ...this.nodes[index], ...newNode }
      } else {
        this.nodes.push(newNode)
      }
    }

    await this.save()
    return nodes
  }

  async deleteNode(nodeId: string) {
    const index = this.nodes.findIndex((n) => n.id === nodeId)
    if (index >= 0) {
      this.nodes.splice(index, 1)
      await this.save()
    }
  }

  getDesktops() {
    return this.desktops
  }

  async createDesktop(desktopId: string, name: string) {
    this.desktops.push({ id: desktopId, name })
    await this.save()
    return { id: desktopId, name }
  }
  async deleteDesktop(desktopId: string) {
    // 删除该桌面的所有节点
    this.nodes = this.nodes.filter((n) => n.desktopId !== desktopId)

    // 删除桌面记录
    this.desktops = this.desktops.filter((d) => d.id !== desktopId)

    await this.save()
    return true
  }

  async fetchFavicon(url: string) {
    try {
      const urlObj = new URL(url)
      const faviconUrl = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
      return { success: true, icon: faviconUrl }
    } catch {
      return { success: false, icon: '' }
    }
  }

  async removeNodesByPluginId(pluginId: string) {
    this.nodes = this.nodes.filter((n) => {
      if (n.type === 'plugin') {
        return n.meta?.pluginId !== pluginId
      } else if (n.type === 'widget' && n.meta?.source === 'plugin') {
        return n.meta?.pluginId !== pluginId
      }
      return true
    })
    await this.save()
  }

  async removeNodesByQuickId(quickId: string) {
    this.nodes = this.nodes.filter((n) => {
      if (n.type === 'quick') {
        return n.meta?.pluginId !== quickId
      } else if (n.type === 'widget' && n.meta?.source === 'quick') {
        return n.meta?.pluginId !== quickId
      }
      return true
    })
    await this.save()
  }
}

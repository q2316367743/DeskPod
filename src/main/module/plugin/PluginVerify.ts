import Type from 'typebox'
import { Compile } from 'typebox/compile'
import { logDebug } from '$/lib/log'

// 定义 PluginEntityCapability 的联合类型校验器
const PluginEntityCapability = Type.Union([
  Type.String(),
  Type.Object({
    identifier: Type.String(),
    allow: Type.Optional(Type.Array(Type.String())),
    deny: Type.Optional(Type.Array(Type.String()))
  })
])

const pluginVerifyType = Type.Object({
  identifier: Type.String(),
  productName: Type.String(),
  version: Type.String(),
  icon: Type.String(),

  // 启动窗口（可选）
  main: Type.Optional(
    Type.Object({
      label: Type.String(),
      title: Type.String(),
      path: Type.String(),
      width: Type.Optional(Type.Number()),
      height: Type.Optional(Type.Number()),
      minWidth: Type.Optional(Type.Number()),
      minHeight: Type.Optional(Type.Number())
    })
  ),

  // 小部件（可选）
  widgets: Type.Optional(
    Type.Array(
      Type.Object({
        label: Type.String(),
        title: Type.String(),
        path: Type.String(),
        layouts: Type.Array(
          Type.Object({
            rows: Type.Number(),
            cols: Type.Number()
          })
        )
      })
    )
  ),

  // 权限
  capabilities: Type.Array(PluginEntityCapability)
})

const T = Compile(pluginVerifyType)

/**
 * 验证插件配置是否有效
 * @param plugin
 */
export function pluginVerify(plugin: Record<string, unknown>): boolean {
  // 先校验格式
  const R = T.Check(plugin)
  logDebug(`格式校验`, R)
  if (!R) return false
  // 在校验，窗口和小部件必须要有一个
  return Boolean(plugin.main || (plugin.widgets && plugin.widgets.length > 0))
}

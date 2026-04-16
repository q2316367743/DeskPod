export function contains<T>(arr: T[], keyword: T): boolean {
  try {
    for (const item of arr) {
      if (item === keyword) {
        return true
      }
    }
    return false
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 指定数组中是否包含关键字数组中任意关键字
 * @param arr 指定数组
 * @param keywords 关键字数组
 */
export function containsArray<T>(arr: T[], keywords: T[]): boolean {
  try {
    for (const item of arr) {
      for (const keyword of keywords) {
        if (item === keyword) {
          return true
        }
      }
    }
    return false
  } catch (e) {
    console.error(e)
    return false
  }
}

export class MapWrapper<K, V> extends Map<K, V> {
  getOrDefault(key: K, defaultValue: V): V {
    return this.get(key) || defaultValue
  }
}

/**
 * 将一个数组变为map
 *
 * @param arr 数组
 * @param attrName 属性名
 * @param merge key冲突合并解决办法
 * @returns map结果
 */
export function map<T extends Record<string, unknown>, K extends T[A], A extends keyof T>(
  arr: T[],
  attrName: A | ((a: T) => string),
  merge?: (item1: T, item2: T) => T
): MapWrapper<K, T> {
  const result = new MapWrapper<K, T>()
  for (const item of arr) {
    const key = (typeof attrName === 'function' ? attrName(item) : item[attrName]) as K
    const old = result.get(key)
    if (old) {
      if (merge) {
        result.set(key, merge(old, item))
      } else {
        throw Error('未设置合并方法，无法合并相同key')
      }
    } else {
      result.set(key, item)
    }
  }
  return result
}

/**
 * 讲一个数组变为set
 * @param arr 数组
 * @param attrName 属性名
 * @param empty 是否允许空值
 */
export function set<T extends S[A], S extends Record<string, unknown>, A extends keyof S>(
  arr: S[],
  attrName: A,
  empty = true
): Set<T> {
  const result = new Set<T>()
  for (const item of arr) {
    if (item[attrName]) {
      result.add(item[attrName] as T)
    } else {
      if (empty) {
        result.add(item[attrName] as T)
      }
    }
  }
  return result
}

/**
 * 根据指定属性名对数组进行分组
 *
 * @param arr 数据
 * @param attrName 属性名
 * @returns 分组后的结果
 */
export function group<T extends Record<string, unknown>, K extends T[A], A extends keyof T>(
  arr: T[],
  attrName: A
): MapWrapper<K, T[]> {
  const result = new MapWrapper<K, T[]>()
  for (const item of arr) {
    const key = item[attrName] as K
    const v = result.get(key) || []
    v.push(item)
    result.set(key, v)
  }
  return result
}

/**
 * 根据指定的属性名进行统计数量
 *
 * @param arr 数据
 * @param attrName 属性名
 * @return 属性 -> 数量
 */
export function count<T, K extends keyof T>(arr: T[], attrName: K): Map<unknown, number> {
  const result = new Map<unknown, number>()
  for (const item of arr) {
    if (result.has(item[attrName])) {
      result.set(item[attrName], result.get(item[attrName])! + 1)
    } else {
      result.set(item[attrName], 1)
    }
  }
  return result
}

export function size<T, K extends keyof T>(arr: Array<T>, attrName: K, value: unknown): number {
  try {
    let count = 0
    for (const t of arr) {
      if (t[attrName] === value) {
        count += 1
      }
    }
    return count
  } catch (e) {
    console.error(e)
    return 0
  }
}

/**
 * 对数组进行去重
 * @param items 数据项
 * @param key 根据的key
 */
export function distinct<T extends Record<string, unknown>, K extends keyof T>(
  items: Array<T>,
  key: K
): Array<T> {
  const keys = new Set<T[K]>()
  const results = new Array<T>()
  for (const item of items) {
    if (!keys.has(item[key])) {
      results.push(item)
      keys.add(item[key])
    }
  }
  return results
}

/**
 * 生成占位符字符串，例如 generatePlaceholders(3) => "$1,$2,$3"
 * @param n - 占位符数量（必须为正整数）
 * @returns 格式为 "$1,$2,...,$n" 的字符串
 */
export function generatePlaceholders(n: number): string {
  if (!Number.isInteger(n) || n < 0) {
    throw Error('Input must be a non-negative integer')
  }
  if (n === 0) return ''
  return Array.from({ length: n }, () => `?`).join(',')
}

/**
 * 抽奖
 * @param list
 */
export function draw<T>(list: Array<T>): T {
  if (list.length === 0) {
    throw Error('Array is empty')
  }
  return list[Math.floor(Math.random() * list.length)]!
}

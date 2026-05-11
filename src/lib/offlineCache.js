import { db } from '../db'

export async function cacheSet(key, data) {
  try {
    await db.cache.put({ key, data, cachedAt: Date.now() })
  } catch {}
}

export async function cacheGet(key) {
  try {
    const row = await db.cache.get(key)
    return row?.data ?? null
  } catch {
    return null
  }
}

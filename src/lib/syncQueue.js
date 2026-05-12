import { db } from '../db'
import { toggleLike, toggleSave, toggleFollow, addComment, deleteRecipe, updateRecipe } from './api'

// Обработчики для каждого типа операции
const HANDLERS = {
  toggleLike:   ({ recipeId, userId })             => toggleLike(recipeId, userId),
  toggleSave:   ({ recipeId, userId })             => toggleSave(recipeId, userId),
  toggleFollow: ({ followerId, followingId })      => toggleFollow(followerId, followingId),
  addComment:   ({ recipeId, authorId, text, parentId }) => addComment({ recipeId, authorId, text, parentId }),
  deleteRecipe: ({ id })                           => deleteRecipe(id),
  updateRecipe: ({ id, updates })                  => updateRecipe(id, updates),
}

// Добавить операцию в очередь
export async function enqueue(type, payload) {
  try {
    await db.syncQueue.add({ type, payload, createdAt: Date.now(), retries: 0 })
  } catch {}
}

// Получить количество ожидающих операций
export async function getPendingCount() {
  try { return await db.syncQueue.count() } catch { return 0 }
}

// Обработать всю очередь (вызывается при появлении сети)
export async function processQueue() {
  if (!navigator.onLine) return
  const items = await db.syncQueue.orderBy('createdAt').toArray()
  if (!items.length) return

  window.dispatchEvent(new CustomEvent('cheff:syncing', { detail: { count: items.length } }))

  let synced = 0
  for (const item of items) {
    const handler = HANDLERS[item.type]
    if (!handler) { await db.syncQueue.delete(item.id); continue }
    try {
      await handler(item.payload)
      await db.syncQueue.delete(item.id)
      synced++
    } catch {
      const retries = (item.retries || 0) + 1
      if (retries >= 3) {
        await db.syncQueue.delete(item.id) // сдаёмся после 3 попыток
      } else {
        await db.syncQueue.update(item.id, { retries })
      }
    }
  }

  window.dispatchEvent(new CustomEvent('cheff:synced', { detail: { synced } }))
}

// Обёртка: если офлайн — ставим в очередь, если онлайн — вызываем напрямую
export async function withSync(type, payload, apiCall) {
  if (!navigator.onLine) {
    await enqueue(type, payload)
    return null
  }
  try {
    return await apiCall()
  } catch (e) {
    // Если во время запроса пропал интернет — ставим в очередь
    if (!navigator.onLine) {
      await enqueue(type, payload)
      return null
    }
    throw e
  }
}

// Запустить слушатель (вызвать один раз при старте приложения)
export function startSyncListener() {
  window.addEventListener('online', processQueue)
  // Обрабатываем очередь сразу, если уже онлайн (например, после перезагрузки)
  if (navigator.onLine) processQueue()
}

export function stopSyncListener() {
  window.removeEventListener('online', processQueue)
}

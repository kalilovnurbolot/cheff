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

// Добавить рецепт в офлайн-подборку (при нажатии закладки)
export async function addToOfflineSaved(recipe) {
  try {
    // Кешируем сам рецепт для страницы RecipeDetail
    await cacheSet(`recipe:${recipe.id}`, recipe)
    // Добавляем в список подборки
    const list = (await cacheGet('offline:saved')) || []
    if (!list.find(r => r.id === recipe.id)) {
      list.unshift({ ...recipe, savedAt: new Date().toISOString() })
      await cacheSet('offline:saved', list)
    }
  } catch {}
}

// Удалить рецепт из офлайн-подборки (при снятии закладки)
export async function removeFromOfflineSaved(recipeId) {
  try {
    const list = (await cacheGet('offline:saved')) || []
    await cacheSet('offline:saved', list.filter(r => r.id !== recipeId))
  } catch {}
}

// Получить все рецепты из офлайн-подборки
export async function getOfflineSaved() {
  return (await cacheGet('offline:saved')) || []
}

// Синхронизировать подборку с сервером (при успешной загрузке онлайн)
export async function syncOfflineSaved(recipes) {
  try {
    await cacheSet('offline:saved', recipes)
    for (const r of recipes) {
      await cacheSet(`recipe:${r.id}`, r)
    }
  } catch {}
}

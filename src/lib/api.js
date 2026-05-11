import { supabase } from './supabase'

// ── helpers ───────────────────────────────────────────────────────────────────
function raise(error) { if (error) throw new Error(error.message) }

// ── profiles ─────────────────────────────────────────────────────────────────
export async function upsertProfile({ google_id, username, full_name, avatar_url, email, bio = '' }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ google_id, username, full_name, avatar_url, email, bio }, { onConflict: 'google_id' })
    .select()
    .single()
  raise(error)
  return data
}

export async function getProfile(googleId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('google_id', googleId)
    .maybeSingle()
  raise(error)
  return data
}

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  raise(error)
  return data
}

export async function updateProfile(id, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  raise(error)
  return data
}

// ── recipes ───────────────────────────────────────────────────────────────────
export async function getFeed({ limit = 20, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      author:profiles(id, username, full_name, avatar_url, google_id),
      location:locations(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  raise(error)
  return data || []
}

export async function getRecipe(id) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      author:profiles(id, username, full_name, avatar_url),
      location:locations(*)
    `)
    .eq('id', id)
    .maybeSingle()
  raise(error)
  return data
}

export async function createRecipe(recipe) {
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipe)
    .select(`*, author:profiles(id, username, full_name, avatar_url)`)
    .single()
  raise(error)
  return data
}

export async function searchRecipes({ query = '', tags = [], ingredients = [] } = {}) {
  let q = supabase
    .from('recipes')
    .select(`*, author:profiles(id, username, avatar_url)`)
    .order('created_at', { ascending: false })

  if (query) {
    q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }
  if (tags.length) {
    q = q.overlaps('tags', tags)
  }
  if (ingredients.length) {
    // all ingredients must be contained
    for (const ing of ingredients) {
      q = q.contains('ingredients', [ing])
    }
  }

  const { data, error } = await q
  raise(error)
  return data || []
}

export async function getUserRecipes(authorId) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
  raise(error)
  return data || []
}

// ── likes ─────────────────────────────────────────────────────────────────────
export async function getLikeStatus(recipeId, userId) {
  if (!userId) return false
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

export async function toggleLike(recipeId, userId) {
  const alreadyLiked = await getLikeStatus(recipeId, userId)
  if (alreadyLiked) {
    await supabase.from('likes').delete().eq('recipe_id', recipeId).eq('user_id', userId)
    await supabase.rpc('decrement_likes', { recipe_id: recipeId })
    return false
  } else {
    await supabase.from('likes').insert({ recipe_id: recipeId, user_id: userId })
    await supabase.rpc('increment_likes', { recipe_id: recipeId })
    return true
  }
}

export async function getLikedRecipes(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('likes')
    .select('recipe:recipes(*, author:profiles(id, username, avatar_url))')
    .eq('user_id', userId)
  raise(error)
  return (data || []).map(d => d.recipe).filter(Boolean)
}

export async function getUserLikes(userId) {
  if (!userId) return []
  const { data } = await supabase.from('likes').select('recipe_id').eq('user_id', userId)
  return (data || []).map(r => r.recipe_id)
}

// ── saved ─────────────────────────────────────────────────────────────────────
export async function getSaveStatus(recipeId, userId) {
  if (!userId) return false
  const { data } = await supabase.from('saved').select('id').eq('recipe_id', recipeId).eq('user_id', userId).maybeSingle()
  return !!data
}

export async function toggleSave(recipeId, userId) {
  const alreadySaved = await getSaveStatus(recipeId, userId)
  if (alreadySaved) {
    await supabase.from('saved').delete().eq('recipe_id', recipeId).eq('user_id', userId)
    return false
  } else {
    await supabase.from('saved').insert({ recipe_id: recipeId, user_id: userId })
    return true
  }
}

export async function getSavedRecipes(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('saved')
    .select(`saved_at, recipe:recipes(*, author:profiles(username, avatar_url))`)
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
  raise(error)
  return (data || []).map(r => ({ ...r.recipe, savedAt: r.saved_at }))
}

// ── comments ──────────────────────────────────────────────────────────────────
export async function getComments(recipeId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`*, author:profiles(id, username, avatar_url)`)
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true })
  raise(error)
  return data || []
}

export async function addComment({ recipeId, authorId, text, parentId = null }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ recipe_id: recipeId, author_id: authorId, text, parent_id: parentId })
    .select(`*, author:profiles(id, username, avatar_url)`)
    .single()
  raise(error)
  return data
}

export async function getCommentLikes(userId) {
  if (!userId) return []
  const { data } = await supabase.from('comment_likes').select('comment_id').eq('user_id', userId)
  return (data || []).map(r => r.comment_id)
}

export async function toggleCommentLike(commentId, userId) {
  const { data: existing } = await supabase.from('comment_likes').select('id').eq('comment_id', commentId).eq('user_id', userId).maybeSingle()
  if (existing) {
    await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', userId)
    await supabase.rpc('decrement_comment_likes', { comment_id: commentId })
    return false
  } else {
    await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: userId })
    await supabase.rpc('increment_comment_likes', { comment_id: commentId })
    return true
  }
}

// ── notifications ─────────────────────────────────────────────────────────────
export async function getNotifications(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('notifications')
    .select(`*, from_user:profiles!from_user_id(username, avatar_url)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  raise(error)
  return data || []
}

export async function addNotification({ userId, type, fromUserId, recipeId, text }) {
  await supabase.from('notifications').insert({ user_id: userId, type, from_user_id: fromUserId, recipe_id: recipeId, text })
}

export async function markAllRead(userId) {
  await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
}

export async function getUnreadCount(userId) {
  if (!userId) return 0
  const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false)
  return count || 0
}

// ── locations ─────────────────────────────────────────────────────────────────
export async function getSuggestedUsers(currentUserId, limit = 5) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .neq('id', currentUserId)
    .limit(limit)
  raise(error)
  return data || []
}

export async function getPopularRecipes(limit = 3) {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, image_url, likes_count, author:profiles(username)')
    .order('likes_count', { ascending: false })
    .limit(limit)
  raise(error)
  return data || []
}

export async function getUserLocation(userId) {
  const { data } = await supabase.from('locations').select('*').eq('user_id', userId).maybeSingle()
  return data
}

export async function upsertLocation(locationData) {
  const { data: existing } = await supabase
    .from('locations')
    .select('id')
    .eq('user_id', locationData.user_id)
    .maybeSingle()

  if (existing) {
    const { data, error } = await supabase
      .from('locations')
      .update(locationData)
      .eq('user_id', locationData.user_id)
      .select()
      .single()
    raise(error)
    return data
  } else {
    const { data, error } = await supabase
      .from('locations')
      .insert(locationData)
      .select()
      .single()
    raise(error)
    return data
  }
}

// ── SQL helpers (Supabase functions — create in SQL Editor) ───────────────────
// Run these once in Supabase SQL Editor:
//
// create or replace function increment_likes(recipe_id uuid)
// returns void language sql as $$
//   update recipes set likes_count = likes_count + 1 where id = recipe_id;
// $$;
//
// create or replace function increment_comment_likes(comment_id uuid)
// returns void language sql as $$
//   update comments set likes_count = likes_count + 1 where id = comment_id;
// $$;

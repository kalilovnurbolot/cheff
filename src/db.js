import Dexie from 'dexie'

export const db = new Dexie('CheffDB')

db.version(2).stores({
  recipes:       '++id, title, authorId, createdAt, *tags, *ingredients',
  saved:         '++id, recipeId, savedAt',
  users:         '++id, username',
  likes:         '++id, recipeId',
  comments:      '++id, recipeId, parentId, authorId, createdAt',
  commentLikes:  '++id, commentId',
  locations:     '++id, userId',
  notifications: '++id, userId, type, read, createdAt',
  stories:       '++id, userId, createdAt',
})

db.version(3).stores({
  recipes:       '++id, title, authorId, createdAt, *tags, *ingredients',
  saved:         '++id, recipeId, savedAt',
  users:         '++id, username',
  likes:         '++id, recipeId',
  comments:      '++id, recipeId, parentId, authorId, createdAt',
  commentLikes:  '++id, commentId',
  locations:     '++id, userId',
  notifications: '++id, userId, type, read, createdAt',
  stories:       '++id, userId, createdAt',
  cache:         'key, cachedAt',
})

db.version(4).stores({
  recipes:       '++id, title, authorId, createdAt, *tags, *ingredients',
  saved:         '++id, recipeId, savedAt',
  users:         '++id, username',
  likes:         '++id, recipeId',
  comments:      '++id, recipeId, parentId, authorId, createdAt',
  commentLikes:  '++id, commentId',
  locations:     '++id, userId',
  notifications: '++id, userId, type, read, createdAt',
  stories:       '++id, userId, createdAt',
  cache:         'key, cachedAt',
  syncQueue:     '++id, type, createdAt',
})

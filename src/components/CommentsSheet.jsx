import { useState, useEffect, useRef } from 'react'
import { X, Heart, Send, CornerDownRight } from 'lucide-react'
import { getComments, addComment, toggleCommentLike, getCommentLikes, addNotification } from '../lib/api'
import { withSync } from '../lib/syncQueue'
import { useRealtimeQuery } from '../hooks/useRealtimeQuery'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

function timeAgo(ts) {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true, locale: ru }) } catch { return '' }
}

function CommentRow({ comment, depth = 0, onReply, onLike, likedIds }) {
  const author = comment.author || {}
  const liked  = likedIds.has(comment.id)

  return (
    <div style={{ paddingLeft: depth > 0 ? 44 : 0 }}>
      <div className="flex gap-3" style={{ padding: '10px 16px' }}>
        <img src={author.avatar_url} alt={author.username}
             style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{author.username}</span>
            <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{comment.text}</span>
          </div>
          <div className="flex items-center gap-4 mt-1.5">
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>{timeAgo(comment.created_at)}</span>
            {(comment.likes_count || 0) > 0 && (
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{comment.likes_count} лайков</span>
            )}
            {depth === 0 && (
              <button onClick={() => onReply(comment)} className="comment-like-btn" style={{ color: 'var(--text3)', fontWeight: 600 }}>
                Ответить
              </button>
            )}
          </div>
        </div>
        <button onClick={() => onLike(comment.id)} className={`comment-like-btn ${liked ? 'liked' : ''}`} style={{ flexShrink: 0, alignSelf: 'flex-start', paddingTop: 4 }}>
          <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

export default function CommentsSheet({ recipeId, recipeAuthorId, onClose }) {
  const { user } = useAuth()
  const toast    = useToast()
  const userId   = user?.supabaseId

  const [text,    setText]    = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [likedIds, setLikedIds] = useState(new Set())
  const inputRef = useRef(null)
  const listRef  = useRef(null)

  const { data: comments } = useRealtimeQuery(
    () => getComments(recipeId),
    'comments',
    `recipe_id=eq.${recipeId}`,
    [recipeId]
  )

  useEffect(() => {
    if (!userId) return
    getCommentLikes(userId).then(ids => setLikedIds(new Set(ids)))
  }, [userId])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const topLevel = (comments || []).filter(c => !c.parent_id)
  const replies  = (comments || []).filter(c => !!c.parent_id)

  async function submit() {
    const t = text.trim()
    if (!t) return
    if (!userId) { toast('Войдите, чтобы оставить комментарий', 'error'); return }
    const payload = { recipeId, authorId: userId, text: t, parentId: replyTo?.id || null }
    try {
      await withSync('addComment', payload, () => addComment(payload))
      if (navigator.onLine && recipeAuthorId && recipeAuthorId !== userId) {
        addNotification({ userId: recipeAuthorId, type: 'comment', fromUserId: userId, recipeId, text: `прокомментировал(а): «${t.slice(0, 40)}»` }).catch(() => {})
      }
      setText('')
      setReplyTo(null)
      toast(navigator.onLine ? 'Комментарий добавлен ✓' : 'Офлайн — отправим когда появится сеть', 'success')
      setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 100)
    } catch {
      toast('Ошибка при добавлении', 'error')
    }
  }

  async function handleLike(commentId) {
    if (!userId) { toast('Войдите, чтобы поставить лайк', 'error'); return }
    const wasLiked = likedIds.has(commentId)
    setLikedIds(prev => { const n = new Set(prev); wasLiked ? n.delete(commentId) : n.add(commentId); return n })
    try {
      await toggleCommentLike(commentId, userId)
    } catch {
      setLikedIds(prev => { const n = new Set(prev); wasLiked ? n.add(commentId) : n.delete(commentId); return n })
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const replyAuthorName = replyTo?.author?.username || ''

  return (
    <>
      <div className="sheet-overlay" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />

        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid var(--border)', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            Комментарии {comments?.length ? `· ${comments.length}` : ''}
          </span>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        <div ref={listRef} className="scroll-area" style={{ flex: 1 }}>
          {(!comments || comments.length === 0) && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
              <p style={{ fontSize: 22, marginBottom: 8 }}>💬</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Пока нет комментариев</p>
              <p style={{ fontSize: 13 }}>Будьте первым!</p>
            </div>
          )}

          {topLevel.map(c => (
            <div key={c.id}>
              <CommentRow comment={c} onReply={setReplyTo} onLike={handleLike} likedIds={likedIds} />
              {replies.filter(r => r.parent_id === c.id).map(r => (
                <div key={r.id} style={{ borderLeft: '2px solid var(--border)', marginLeft: 52 }}>
                  <CommentRow comment={r} depth={1} onReply={() => {}} onLike={handleLike} likedIds={likedIds} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {replyTo && (
          <div className="flex items-center gap-2 px-4 py-2" style={{ borderTop: '0.5px solid var(--border)', background: 'var(--bg4)', flexShrink: 0 }}>
            <CornerDownRight size={14} color="var(--text3)" />
            <span style={{ fontSize: 13, color: 'var(--text3)', flex: 1 }}>
              Ответ для <strong style={{ color: 'var(--text2)' }}>@{replyAuthorName}</strong>
            </span>
            <button onClick={() => setReplyTo(null)} className="btn-ghost" style={{ padding: 4 }}>
              <X size={15} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: '0.5px solid var(--border)', flexShrink: 0 }}>
          {user?.avatar && (
            <img src={user.avatar} alt="me" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={userId ? 'Добавить комментарий...' : 'Войдите, чтобы комментировать'}
              disabled={!userId}
              rows={1}
              style={{ resize: 'none', borderRadius: 20, padding: '9px 44px 9px 16px', fontSize: 14, lineHeight: 1.4, maxHeight: 100, overflowY: 'auto' }}
            />
            <button
              onClick={submit}
              disabled={!text.trim() || !userId}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: text.trim() && userId ? 'pointer' : 'default',
                color: text.trim() && userId ? 'var(--orange)' : 'var(--text3)', padding: 4,
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

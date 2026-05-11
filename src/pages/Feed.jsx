import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, PlayCircle } from 'lucide-react'
import { getFeed, toggleLike, toggleSave, getUserLikes, getSavedRecipes, addNotification } from '../lib/api'
import { useRealtimeQuery } from '../hooks/useRealtimeQuery'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import StoryViewer from '../components/StoryViewer'
import CommentsSheet from '../components/CommentsSheet'

function formatLikes(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'К'
  return String(n)
}

function timeLabel(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 60000)    return 'только что'
  if (diff < 3600000)  return Math.floor(diff / 60000) + ' мин. назад'
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' ч. назад'
  return Math.floor(diff / 86400000) + ' д. назад'
}

function HeartBurst({ show }) {
  if (!show) return null
  return (
    <div className="heart-burst-container">
      <svg className="heart-burst" width="100" height="100" viewBox="0 0 24 24">
        <path fill="white" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  )
}

function PostCard({ recipe, isLiked: initLiked, isSaved: initSaved, onToggleLike, onToggleSave, onOpenComments, userId }) {
  const navigate   = useNavigate()
  const toast      = useToast()

  const [liked,      setLiked]      = useState(initLiked)
  const [saved,      setSaved]      = useState(initSaved)
  const [localLikes, setLocalLikes] = useState(recipe.likes_count || 0)
  const [likeAnim,   setLikeAnim]   = useState(false)
  const [heartBurst, setHeartBurst] = useState(false)
  const lastTap = useRef(0)

  useEffect(() => { setLiked(initLiked) }, [initLiked])
  useEffect(() => { setSaved(initSaved) }, [initSaved])

  async function doLike() {
    if (!userId) { toast('Войдите, чтобы поставить лайк', 'error'); return }
    const next = !liked
    setLiked(next)
    setLocalLikes(l => next ? l + 1 : Math.max(0, l - 1))
    if (next) { setLikeAnim(true); setTimeout(() => setLikeAnim(false), 350) }
    try {
      await toggleLike(recipe.id, userId)
      if (next && recipe.author?.id && recipe.author.id !== userId) {
        addNotification({ userId: recipe.author.id, type: 'like', fromUserId: userId, recipeId: recipe.id, text: 'оценил(а) ваш рецепт' }).catch(() => {})
      }
      onToggleLike(recipe.id, next)
    } catch {
      setLiked(!next)
      setLocalLikes(l => next ? Math.max(0, l - 1) : l + 1)
    }
  }

  async function doSave() {
    if (!userId) { toast('Войдите, чтобы сохранить', 'error'); return }
    const next = !saved
    setSaved(next)
    try {
      await toggleSave(recipe.id, userId)
      onToggleSave(recipe.id, next)
      toast(next ? 'Сохранено ✓' : 'Удалено из сохранённых', next ? 'success' : undefined)
    } catch {
      setSaved(!next)
    }
  }

  function handleImageTap() {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      if (!liked) {
        doLike()
        setHeartBurst(true)
        setTimeout(() => setHeartBurst(false), 650)
      }
    }
    lastTap.current = now
  }

  async function handleShare() {
    const url  = window.location.origin + '/recipe/' + recipe.id
    const data = { title: recipe.title, text: recipe.description, url }
    if (navigator.share) { try { await navigator.share(data); return } catch {} }
    await navigator.clipboard.writeText(url).catch(() => {})
    toast('Ссылка скопирована!', 'success')
  }

  const author = recipe.author || {}

  return (
    <article style={{ borderBottom: '0.5px solid var(--border)' }}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5" style={{ cursor: 'pointer' }} onClick={() => navigate(author.id && author.id !== userId ? '/profile/' + author.id : '/profile')}>
          <div className="story-ring" style={{ padding: 2 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--bg)' }}>
              <img src={author.avatar_url} alt={author.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{author.username}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{recipe.cook_time} · {recipe.difficulty}</div>
          </div>
        </div>
        <button className="btn-ghost" style={{ padding: 4 }}>
          <MoreHorizontal size={20} color="var(--text2)" />
        </button>
      </div>

      <div
        style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: 'var(--bg3)' }}
        onClick={handleImageTap}
      >
        <img src={recipe.image_url} alt={recipe.title}
             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        <HeartBurst show={heartBurst} />
        <button
          onClick={e => { e.stopPropagation(); navigate('/recipe/' + recipe.id + '?cook=1') }}
          style={{
            position: 'absolute', bottom: 12, right: 12,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            border: 'none', borderRadius: 20, color: 'white',
            padding: '7px 13px', fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
          }}
        >
          <PlayCircle size={14} color="var(--orange)" /> Готовить
        </button>
      </div>

      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <div className="flex items-center gap-4">
          <button className="action-btn" onClick={doLike}>
            <Heart size={26} className={likeAnim ? 'like-pop' : ''} fill={liked ? 'var(--red)' : 'none'} color={liked ? 'var(--red)' : 'var(--text)'} strokeWidth={liked ? 0 : 1.8} />
          </button>
          <button className="action-btn" onClick={() => onOpenComments(recipe)}>
            <MessageCircle size={26} strokeWidth={1.8} />
          </button>
          <button className="action-btn" onClick={handleShare}>
            <Send size={24} strokeWidth={1.8} style={{ transform: 'rotate(-10deg)' }} />
          </button>
        </div>
        <button className="action-btn" onClick={doSave}>
          <Bookmark size={26} strokeWidth={1.8} fill={saved ? 'var(--text)' : 'none'} color="var(--text)" />
        </button>
      </div>

      <div className="px-3 mb-1" style={{ fontSize: 13, fontWeight: 700 }}>
        {formatLikes(localLikes)} отметок «Нравится»
      </div>

      <div className="px-3 mb-1" style={{ fontSize: 14, lineHeight: 1.4 }} onClick={() => navigate('/recipe/' + recipe.id)}>
        <span style={{ fontWeight: 700, marginRight: 6 }}>{author.username}</span>
        <span style={{ color: 'var(--text2)' }}>{recipe.description}</span>
      </div>

      <div className="px-3 mb-1">
        {(recipe.tags || []).map(t => (
          <span key={t} style={{ fontSize: 13, color: 'var(--blue)', marginRight: 5 }}>#{t}</span>
        ))}
      </div>

      <button
        className="px-3 mb-2"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 13, display: 'block', textAlign: 'left', padding: '0 12px 4px' }}
        onClick={() => onOpenComments(recipe)}
      >
        Добавить комментарий...
      </button>

      <div className="px-3 pb-3" style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {timeLabel(recipe.created_at)}
      </div>
    </article>
  )
}

function StoryItem({ user, onOpen }) {
  return (
    <button onClick={onOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
      <div className="story-ring">
        <div style={{ width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid var(--bg)', background: 'var(--bg3)' }}>
          <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        </div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 66, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {user.username}
      </span>
    </button>
  )
}

export default function Feed() {
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const userId     = user?.supabaseId

  const [userLikes,    setUserLikes]    = useState(new Set())
  const [userSaves,    setUserSaves]    = useState(new Set())
  const [storyViewer,  setStoryViewer]  = useState(null)
  const [commentsFor,  setCommentsFor]  = useState(null)

  const { data: recipes, loading } = useRealtimeQuery(
    () => getFeed({ limit: 30 }),
    'recipes',
    null,
    []
  )

  useEffect(() => {
    if (!userId) return
    getUserLikes(userId).then(ids => setUserLikes(new Set(ids)))
    getSavedRecipes(userId).then(recs => setUserSaves(new Set(recs.map(r => r.id))))
  }, [userId])

  const storyData = useMemo(() => {
    if (!recipes) return []
    const map = {}
    recipes.forEach(r => {
      if (!r.author) return
      const aid = r.author.id
      if (!map[aid]) map[aid] = { id: aid, username: r.author.username, avatar: r.author.avatar_url, items: [] }
      if (map[aid].items.length < 3) {
        map[aid].items.push({ image: r.image_url, caption: r.title, timeAgo: timeLabel(r.created_at) })
      }
    })
    return Object.values(map).filter(u => u.items.length > 0)
  }, [recipes])

  function handleToggleLike(recipeId, isNowLiked) {
    setUserLikes(prev => {
      const next = new Set(prev)
      isNowLiked ? next.add(recipeId) : next.delete(recipeId)
      return next
    })
  }

  function handleToggleSave(recipeId, isNowSaved) {
    setUserSaves(prev => {
      const next = new Set(prev)
      isNowSaved ? next.add(recipeId) : next.delete(recipeId)
      return next
    })
  }

  if (loading && !recipes) return (
    <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text3)' }}>
      <span style={{ fontSize: 40 }}>👨‍🍳</span>
      <span style={{ fontSize: 14 }}>Загрузка...</span>
    </div>
  )

  return (
    <>
      <Layout>
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
          borderBottom: '0.5px solid var(--border)',
          padding: `calc(var(--safe-top) + 6px) 16px 10px`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span className="gradient-text" style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1.5 }}>cheff</span>
          {user?.avatar && (
            <div onClick={() => navigate('/profile')}
                 style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px solid var(--border)' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div style={{ borderBottom: '0.5px solid var(--border)' }}>
          <div className="scroll-area" style={{ display: 'flex', gap: 12, padding: '12px 12px', overflowX: 'auto', overflowY: 'hidden' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <div style={{
                width: 62, height: 62, borderRadius: '50%', background: 'var(--bg4)',
                border: '1.5px dashed var(--border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 26, color: 'var(--text3)',
              }}>+</div>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>Добавить</span>
            </button>
            {storyData.map((u, i) => (
              <StoryItem key={u.id} user={u} onOpen={() => setStoryViewer({ stories: storyData, startIndex: i })} />
            ))}
          </div>
        </div>

        <div>
          {(recipes || []).map(r => (
            <PostCard
              key={r.id}
              recipe={r}
              isLiked={userLikes.has(r.id)}
              isSaved={userSaves.has(r.id)}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
              onOpenComments={setCommentsFor}
              userId={userId}
            />
          ))}
          {recipes?.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text3)' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🍽️</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)' }}>Рецептов пока нет</p>
              <p style={{ fontSize: 13 }}>Будьте первым — опубликуйте рецепт!</p>
            </div>
          )}
        </div>
      </Layout>

      {storyViewer && (
        <StoryViewer
          stories={storyViewer.stories}
          startIndex={storyViewer.startIndex}
          onClose={() => setStoryViewer(null)}
        />
      )}

      {commentsFor && (
        <CommentsSheet
          recipeId={commentsFor.id}
          recipeAuthorId={commentsFor.author?.id}
          onClose={() => setCommentsFor(null)}
        />
      )}
    </>
  )
}

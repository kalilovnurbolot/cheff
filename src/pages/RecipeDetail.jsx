import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Heart, Share2, Bookmark, Clock, ChefHat, Users,
  Play, Pause, RotateCcw, CheckCircle2, Circle, Flame,
  Monitor, MessageCircle, Star, MapPin
} from 'lucide-react'
import { getRecipe, toggleLike, toggleSave, getLikeStatus, getSaveStatus } from '../lib/api'
import { cacheGet, cacheSet } from '../lib/offlineCache'
import { useRealtimeQuery } from '../hooks/useRealtimeQuery'
import { getComments } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Layout from '../components/Layout'
import CommentsSheet from '../components/CommentsSheet'
import LocationCard from '../components/LocationCard'

function useTimer(initial) {
  const [secs, setSecs]       = useState(initial)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (running && secs > 0) {
      ref.current = setInterval(() => setSecs(s => s - 1), 1000)
    } else {
      clearInterval(ref.current)
      if (secs <= 0) setRunning(false)
    }
    return () => clearInterval(ref.current)
  }, [running, secs])

  const toggle = () => setRunning(r => !r)
  const reset  = () => { setRunning(false); setSecs(initial) }
  const fmt    = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  return { secs, running, toggle, reset, fmt }
}

function useWakeLock() {
  const lock = useRef(null)
  const [active, setActive] = useState(false)

  async function request() {
    if (!('wakeLock' in navigator)) return
    try {
      lock.current = await navigator.wakeLock.request('screen')
      setActive(true)
      lock.current.addEventListener('release', () => setActive(false))
    } catch {}
  }
  function release() { lock.current?.release(); lock.current = null; setActive(false) }
  useEffect(() => () => lock.current?.release(), [])
  return { active, request, release }
}

function StarRating({ value = 0, count = 0, onRate }) {
  const [hover, setHover] = useState(0)
  const display = hover || Math.round(value)
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <span key={i} className="star"
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
                onClick={() => onRate(i)}>
            {i <= display ? '★' : '☆'}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 13, color: 'var(--text3)' }}>{value.toFixed(1)} ({count})</span>
    </div>
  )
}

function StepCard({ step, index, done, active, onToggle }) {
  const timer = useTimer((step.duration || 5) * 60)

  useEffect(() => {
    if (timer.secs === 0 && step.duration && !timer.running) {
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200])
    }
  }, [timer.secs])

  return (
    <div style={{
      background: active ? 'rgba(255,107,53,0.06)' : 'var(--bg3)',
      border: `0.5px solid ${active ? 'var(--orange)' : 'var(--border)'}`,
      borderRadius: 16, padding: 16, marginBottom: 10, transition: 'all 0.25s'
    }}>
      <div className="flex gap-3">
        <button onClick={() => onToggle(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2 }}>
          {done
            ? <CheckCircle2 size={22} color="var(--orange)" fill="rgba(255,107,53,0.15)" />
            : <Circle size={22} color={active ? 'var(--orange)' : 'var(--border)'} />}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Шаг {index + 1}
          </div>
          <div style={{ fontSize: 15, color: done ? 'var(--text3)' : 'var(--text)', lineHeight: 1.55, textDecoration: done ? 'line-through' : 'none' }}>
            {step.text}
          </div>
          {step.duration > 0 && (
            <div className="flex items-center gap-3 mt-3">
              <span className="font-mono font-bold" style={{
                fontSize: 26, color: timer.secs < 30 ? 'var(--red)' : 'var(--orange)',
                ...(timer.running ? { animation: 'timerPulse 1s ease-in-out infinite' } : {})
              }}>
                {timer.fmt(timer.secs)}
              </span>
              <button onClick={timer.toggle} style={{
                background: 'var(--orange)', border: 'none', borderRadius: 8,
                color: '#fff', padding: '7px 14px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5
              }}>
                {timer.running ? <Pause size={14} /> : <Play size={14} />}
                {timer.running ? 'Пауза' : 'Старт'}
              </button>
              <button onClick={timer.reset} className="btn-ghost" style={{ padding: 6 }}>
                <RotateCcw size={15} color="var(--text3)" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RecipeDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [sp]       = useSearchParams()
  const toast      = useToast()
  const wakeLock   = useWakeLock()
  const { user }   = useAuth()
  const userId     = user?.supabaseId

  const [recipe,     setRecipe]     = useState(null)
  const [liked,      setLiked]      = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [doneSteps,  setDoneSteps]  = useState(new Set())
  const [activeTab,  setActiveTab]  = useState(sp.get('cook') === '1' ? 'cook' : 'info')
  const [showComments, setShowComments] = useState(false)
  const [myRating,   setMyRating]   = useState(0)

  useEffect(() => {
    let active = true
    const key = `recipe:${id}`
    getRecipe(id).then(rec => {
      if (!active || !rec) return
      setRecipe(rec)
      cacheSet(key, rec)
    }).catch(async () => {
      if (!active) return
      const cached = await cacheGet(key)
      if (cached) setRecipe(cached)
    })
    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (!recipe || !userId) return
    getLikeStatus(recipe.id, userId).then(setLiked)
    getSaveStatus(recipe.id, userId).then(setSaved)
  }, [recipe?.id, userId])

  useEffect(() => {
    if (activeTab === 'cook') wakeLock.request()
    else wakeLock.release()
  }, [activeTab])

  const { data: comments } = useRealtimeQuery(
    () => getComments(id),
    'comments',
    `recipe_id=eq.${id}`,
    [id]
  )
  const commentCount = comments?.length || 0

  async function doToggleLike() {
    if (!userId) { toast('Войдите, чтобы поставить лайк', 'error'); return }
    const next = !liked
    setLiked(next)
    try { await toggleLike(recipe.id, userId) }
    catch { setLiked(!next) }
  }

  async function doToggleSave() {
    if (!userId) { toast('Войдите, чтобы сохранить', 'error'); return }
    const next = !saved
    setSaved(next)
    try {
      await toggleSave(recipe.id, userId)
      toast(next ? 'Сохранено ✓' : 'Удалено из сохранённых', next ? 'success' : undefined)
    } catch {
      setSaved(!next)
    }
  }

  async function handleShare() {
    const url  = window.location.origin + '/recipe/' + id
    const data = { title: recipe?.title, text: recipe?.description, url }
    if (navigator.share) { try { await navigator.share(data); return } catch {} }
    await navigator.clipboard.writeText(url).catch(() => {})
    toast('Ссылка скопирована!', 'success')
  }

  function toggleStep(i) {
    setDoneSteps(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  }

  if (!recipe) return (
    <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
      <ChefHat size={40} />
    </div>
  )

  const steps    = recipe.steps || []
  const progress = steps.length ? Math.round((doneSteps.size / steps.length) * 100) : 0
  const author   = recipe.author || {}
  const location = recipe.location

  return (
    <>
      <Layout hideNav>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, transparent)' }} />

          <button onClick={() => navigate(-1)} style={{
            position: 'absolute', top: `calc(var(--safe-top) + 12px)`, left: 14,
            width: 38, height: 38, borderRadius: 12, background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)', border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            <ArrowLeft size={20} />
          </button>

          <div style={{ position: 'absolute', top: `calc(var(--safe-top) + 12px)`, right: 14, display: 'flex', gap: 8 }}>
            <button onClick={handleShare} style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={18} />
            </button>
            <button onClick={doToggleSave} style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: 'none', color: saved ? 'var(--orange)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bookmark size={18} fill={saved ? 'var(--orange)' : 'none'} />
            </button>
          </div>

          <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: -0.3 }}>{recipe.title}</h1>
            <div className="flex gap-2 flex-wrap">
              {[
                { icon: Clock,   val: recipe.cook_time },
                { icon: ChefHat, val: recipe.difficulty },
                { icon: Users,   val: `${recipe.servings} порц.` },
              ].map(({ icon: Icon, val }) => (
                <span key={val} style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon size={11} /> {val}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex sticky top-0 z-20"
             style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid var(--border)' }}>
          {[['info','Рецепт'],['cook','Готовка'],['ingredients','Состав']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '13px 0', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab ? 'var(--orange)' : 'var(--text3)', fontSize: 13, fontWeight: 600,
              borderBottom: activeTab === tab ? '2px solid var(--orange)' : '2px solid transparent',
              transition: 'color 0.18s'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 16px 100px' }}>

          {activeTab === 'info' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="flex items-center gap-3">
                <div
                  style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}
                  onClick={() => navigate(author.id && author.id !== userId ? '/profile/' + author.id : '/profile')}
                >
                  <img src={author.avatar_url} alt={author.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(author.id && author.id !== userId ? '/profile/' + author.id : '/profile')}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{author.username}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{(author.followers_count || 0).toLocaleString('ru')} подписчиков</div>
                </div>
                <button onClick={doToggleLike} className="action-btn">
                  <Heart size={26} fill={liked ? 'var(--red)' : 'none'} color={liked ? 'var(--red)' : 'var(--text3)'} strokeWidth={liked ? 0 : 1.8} />
                </button>
              </div>

              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.65 }}>{recipe.description}</p>

              <div className="flex gap-2 flex-wrap">
                {(recipe.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}
              </div>

              <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>Оцените рецепт</div>
                <StarRating
                  value={myRating || (recipe.rating || 0)}
                  count={recipe.rating_count || 0}
                  onRate={stars => { setMyRating(stars); toast(`Вы поставили ${stars} ★`, 'success') }}
                />
              </div>

              {location && (
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} color="var(--orange)" /> Попробуйте в заведении
                  </div>
                  <LocationCard location={location} />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: 15, fontWeight: 700 }}>Комментарии {commentCount > 0 ? `· ${commentCount}` : ''}</span>
                  <button onClick={() => setShowComments(true)} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Все</button>
                </div>
                <button onClick={() => setShowComments(true)}
                        style={{ width: '100%', background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text3)', fontSize: 14 }}>
                  <MessageCircle size={16} /> Добавить комментарий...
                </button>
              </div>

              <button className="btn-primary" onClick={() => setActiveTab('cook')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Flame size={18} /> Начать готовить
              </button>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Ингредиенты</h2>
                <span style={{ fontSize: 13, color: 'var(--text3)', background: 'var(--bg4)', padding: '4px 10px', borderRadius: 8 }}>
                  {recipe.servings} порции
                </span>
              </div>
              {(recipe.ingredients || []).map((ing, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '0.5px solid var(--border)' }}>
                  <span style={{ fontSize: 15 }}>{ing}</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cook' && (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Пошаговая готовка</h2>
                <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: wakeLock.active ? 'var(--green)' : 'var(--text3)' }}>
                  <Monitor size={13} />
                  {wakeLock.active ? 'Экран активен' : 'Экран может гаснуть'}
                </div>
              </div>

              <div style={{ background: 'var(--bg4)', borderRadius: 8, height: 6, marginBottom: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 8, background: 'linear-gradient(90deg, var(--orange), #FF3CAC)', width: progress + '%', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20 }}>
                {doneSteps.size} из {steps.length} шагов · {progress}%
              </div>

              {steps.map((step, i) => (
                <StepCard key={i} step={step} index={i}
                          done={doneSteps.has(i)}
                          active={!doneSteps.has(i) && (i === 0 || doneSteps.has(i - 1))}
                          onToggle={toggleStep} />
              ))}

              {steps.length > 0 && doneSteps.size === steps.length && (
                <div style={{ textAlign: 'center', padding: 36, marginTop: 16, background: 'rgba(255,107,53,0.06)', borderRadius: 20, border: '0.5px solid var(--orange)' }}>
                  <div style={{ fontSize: 52, marginBottom: 10 }}>🎉</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--orange)' }}>Блюдо готово!</div>
                  <div style={{ fontSize: 14, color: 'var(--text3)', marginTop: 4 }}>Приятного аппетита!</div>
                  <button onClick={() => setShowComments(true)} className="btn-primary" style={{ marginTop: 20 }}>
                    Оставить отзыв
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>

      {showComments && (
        <CommentsSheet
          recipeId={id}
          recipeAuthorId={author.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  )
}

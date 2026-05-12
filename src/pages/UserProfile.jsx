import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Grid3X3, Heart, UserPlus, UserCheck } from 'lucide-react'
import { getProfileById, getUserRecipes, getLikedRecipes, getFollowStatus, toggleFollow } from '../lib/api'
import { withSync } from '../lib/syncQueue'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Layout from '../components/Layout'

export default function UserProfile() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const toast     = useToast()

  const [profile,     setProfile]     = useState(null)
  const [recipes,     setRecipes]     = useState([])
  const [liked,       setLiked]       = useState([])
  const [tab,         setTab]         = useState('recipes')
  const [loading,     setLoading]     = useState(true)
  const [following,   setFollowing]   = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const isOwnProfile = user?.supabaseId === id

  useEffect(() => {
    if (isOwnProfile) { navigate('/profile', { replace: true }); return }

    let active = true
    setLoading(true)
    Promise.all([
      getProfileById(id),
      getUserRecipes(id),
      getLikedRecipes(id),
      getFollowStatus(user?.supabaseId, id),
    ]).then(([prof, recs, lks, isFollowing]) => {
      if (!active) return
      setProfile(prof)
      setRecipes(recs || [])
      setLiked(lks || [])
      setFollowing(isFollowing)
    }).finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [id])

  async function handleFollow() {
    if (!user?.supabaseId) { toast('Войдите чтобы подписаться', 'error'); return }
    setFollowLoading(true)
    const next = !following
    setFollowing(next)
    try {
      await withSync(
        'toggleFollow',
        { followerId: user.supabaseId, followingId: id },
        () => toggleFollow(user.supabaseId, id)
      )
      if (navigator.onLine) {
        const fresh = await getProfileById(id)
        if (fresh) setProfile(fresh)
      }
      toast(
        navigator.onLine
          ? (next ? 'Вы подписались' : 'Вы отписались')
          : 'Офлайн — синхронизируем когда появится сеть',
        'success'
      )
    } catch (e) {
      setFollowing(!next)
      toast('Ошибка: ' + (e.message || 'нет доступа'), 'error')
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) return (
    <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text3)' }}>
      <span style={{ fontSize: 40 }}>👨‍🍳</span>
      <span style={{ fontSize: 14 }}>Загрузка...</span>
    </div>
  )

  if (!profile) return (
    <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
      <p>Профиль не найден</p>
    </div>
  )

  const displayRecipes = tab === 'recipes' ? recipes : liked

  return (
    <Layout hideNav>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: `calc(var(--safe-top) + 10px) 16px 10px`,
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid var(--border)'
      }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: 4, flexShrink: 0 }}>
          <ArrowLeft size={22} />
        </button>
        <div style={{ fontSize: 17, fontWeight: 800, flex: 1 }}>{profile.username}</div>
      </div>

      {/* Profile section */}
      <div style={{ padding: '20px 16px 16px' }}>
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="story-ring" style={{ flexShrink: 0 }}>
            <div style={{ width: 78, height: 78, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--bg)' }}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'var(--text3)' }}>
                    {profile.username?.[0]?.toUpperCase()}
                  </div>
              }
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-5" style={{ flex: 1, justifyContent: 'space-around' }}>
            {[
              { label: 'Рецептов',  value: recipes.length },
              { label: 'Подп-ков',  value: (profile.followers_count || 0).toLocaleString('ru') },
              { label: 'Подписки',  value: profile.following_count || 0 },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Name & bio */}
        <div style={{ marginTop: 14 }}>
          {profile.full_name && (
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{profile.full_name}</div>
          )}
          {profile.bio && (
            <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{profile.bio}</div>
          )}
        </div>

        {/* Follow button */}
        <button onClick={handleFollow} disabled={followLoading} style={{
          marginTop: 14, width: '100%',
          background: following ? 'var(--bg4)' : 'var(--orange)',
          border: following ? '0.5px solid var(--border)' : 'none',
          borderRadius: 10, padding: '10px 0', fontSize: 14, fontWeight: 700,
          color: following ? 'var(--text)' : '#fff',
          cursor: followLoading ? 'default' : 'pointer',
          fontFamily: 'inherit', opacity: followLoading ? 0.6 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 0.2s',
        }}>
          {following ? <><UserCheck size={15} /> Вы подписаны</> : <><UserPlus size={15} /> Подписаться</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex sticky top-0 z-10" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid var(--border)' }}>
        {[['recipes', Grid3X3], ['liked', Heart]].map(([t, Icon]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === t ? '1.5px solid var(--orange)' : '1.5px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit'
          }}>
            <Icon size={22} color={tab === t ? 'var(--orange)' : 'var(--text3)'} />
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, paddingBottom: 20 }}>
        {displayRecipes.map(r => (
          <div key={r.id} onClick={() => navigate('/recipe/' + r.id)}
               style={{ aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg3)' }}>
            <img src={r.image_url} alt={r.title}
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
        ))}
        {displayRecipes.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
            <p style={{ fontSize: 14 }}>Нет рецептов</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

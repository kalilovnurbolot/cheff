import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Grid3X3, Heart, Bookmark, Download, WifiOff, MapPin, Edit3, Plus, Check, LogOut } from 'lucide-react'
import { getUserRecipes, getSavedRecipes, getLikedRecipes, getUserLocation, upsertLocation, getProfile, updateProfile } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Layout from '../components/Layout'
import LocationCard from '../components/LocationCard'
import LocationPicker from '../components/LocationPicker'

export default function Profile() {
  const navigate           = useNavigate()
  const toast              = useToast()
  const { user, signOut }  = useAuth()
  const userId             = user?.supabaseId

  const [profile,    setProfile]    = useState(null)
  const [myRecipes,  setMyRecipes]  = useState([])
  const [savedRecs,  setSavedRecs]  = useState([])
  const [likedRecs,  setLikedRecs]  = useState([])
  const [myLocation, setMyLocation] = useState(null)
  const [tab,        setTab]        = useState('recipes')
  const [offline,    setOffline]    = useState(!navigator.onLine)
  const [cacheSize,  setCacheSize]  = useState(null)
  const [editBio,    setEditBio]    = useState(false)
  const [bio,        setBio]        = useState('')
  const [showLocPicker, setShowLocPicker] = useState(false)
  const [locDraft,   setLocDraft]   = useState(null)

  useEffect(() => {
    if (!userId) return
    getProfile(user.googleId).then(p => {
      if (p) { setProfile(p); setBio(p.bio || '') }
    })
    getUserRecipes(userId).then(setMyRecipes)
    getSavedRecipes(userId).then(setSavedRecs)
    getLikedRecipes(userId).then(setLikedRecs)
    getUserLocation(userId).then(loc => { if (loc) setMyLocation(loc) })

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(({ usage }) => {
        if (usage) setCacheSize((usage / 1024 / 1024).toFixed(1))
      })
    }

    const on  = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [userId])

  async function saveBio() {
    if (!userId) return
    try {
      await updateProfile(userId, { bio })
      setEditBio(false)
      toast('Сохранено ✓', 'success')
    } catch {
      toast('Ошибка при сохранении', 'error')
    }
  }

  async function saveLocation() {
    if (!locDraft?.businessName || !userId) return
    try {
      const payload = {
        user_id:       userId,
        business_name: locDraft.businessName,
        address:       locDraft.address  || '',
        phone:         locDraft.phone    || '',
        hours:         locDraft.hours    || '',
        website:       locDraft.website  || '',
        lat:           locDraft.lat      || null,
        lng:           locDraft.lng      || null,
        category:      locDraft.category || 'Ресторан',
      }
      const saved = await upsertLocation(payload)
      setMyLocation(saved)
      setShowLocPicker(false)
      setLocDraft(null)
      toast('Локация сохранена ✓', 'success')
    } catch {
      toast('Ошибка при сохранении', 'error')
    }
  }

  const displayRecipes =
    tab === 'recipes' ? myRecipes :
    tab === 'saved'   ? savedRecs :
    likedRecs

  const displayName = profile?.full_name  || user?.name     || 'Мой профиль'
  const username    = profile?.username   || user?.username || 'chef'
  const avatar      = profile?.avatar_url || user?.avatar   || ''
  const email       = profile?.email      || user?.email    || ''
  const followers   = profile?.followers_count || 0
  const following   = profile?.following_count || 0

  return (
    <Layout>
      <div style={{
        padding: `calc(var(--safe-top) + 10px) 16px 10px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '0.5px solid var(--border)'
      }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{username}</div>
          {email && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{email}</div>}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" style={{ padding: 6 }} title="Выйти"
                  onClick={() => { if (confirm('Выйти из Cheff?')) signOut() }}>
            <LogOut size={18} color="var(--text3)" />
          </button>
          <button className="btn-ghost" style={{ padding: 4 }}>
            <Settings size={22} color="var(--text2)" />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 16px 12px' }}>
        <div className="flex items-center gap-5">
          <div className="story-ring" style={{ flexShrink: 0 }}>
            <div style={{ width: 78, height: 78, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--bg)' }}>
              {avatar
                ? <img src={avatar} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'var(--text3)' }}>
                    {username[0]?.toUpperCase()}
                  </div>
              }
            </div>
          </div>

          <div className="flex gap-5" style={{ flex: 1, justifyContent: 'space-around' }}>
            {[
              { label: 'Рецептов',  value: myRecipes.length },
              { label: 'Подп-ков',  value: followers.toLocaleString('ru') },
              { label: 'Подписки',  value: following },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          {editBio ? (
            <div className="flex gap-2">
              <input value={bio} onChange={e => setBio(e.target.value)} style={{ flex: 1 }} />
              <button onClick={saveBio}
                      style={{ background: 'var(--orange)', border: 'none', borderRadius: 10, color: '#fff', padding: '0 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5, flex: 1 }}>{bio || 'Добавьте описание профиля'}</span>
              <button onClick={() => setEditBio(true)} className="btn-ghost" style={{ padding: 2, flexShrink: 0 }}>
                <Edit3 size={14} color="var(--text3)" />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => setEditBio(true)} style={{
            flex: 1, background: 'var(--bg4)', border: '0.5px solid var(--border)',
            borderRadius: 10, padding: '9px 0', fontSize: 14, fontWeight: 600,
            color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit'
          }}>
            Редактировать
          </button>
          <button onClick={() => navigate('/create')} style={{
            flex: 1, background: 'var(--orange)', border: 'none',
            borderRadius: 10, padding: '9px 0', fontSize: 14, fontWeight: 600,
            color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
          }}>
            <Plus size={15} /> Рецепт
          </button>
        </div>

      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          padding: '12px 14px', borderRadius: 14,
          background: offline ? 'rgba(255,214,10,0.06)' : 'rgba(74,222,128,0.06)',
          border: `0.5px solid ${offline ? 'rgba(255,214,10,0.25)' : 'rgba(74,222,128,0.25)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div className="flex items-center gap-2">
            {offline ? <WifiOff size={16} color="#FFD60A" /> : <Download size={16} color="var(--green)" />}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: offline ? '#FFD60A' : 'var(--green)' }}>
                {offline ? 'Офлайн' : 'Онлайн'}
              </div>
              {cacheSize && <div style={{ fontSize: 11, color: 'var(--text3)' }}>Кэш: {cacheSize} МБ</div>}
            </div>
          </div>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: offline ? '#FFD60A' : 'var(--green)', boxShadow: `0 0 8px ${offline ? '#FFD60A' : 'var(--green)'}` }} />
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={14} color="var(--orange)" /> Моё заведение
          </span>
          <button onClick={() => { setLocDraft(myLocation ? { businessName: myLocation.business_name, address: myLocation.address, phone: myLocation.phone, hours: myLocation.hours, website: myLocation.website, lat: myLocation.lat, lng: myLocation.lng, category: myLocation.category } : {}); setShowLocPicker(p => !p) }}
                  className="btn-ghost" style={{ fontSize: 13, color: 'var(--blue)', padding: '4px 8px' }}>
            {showLocPicker ? 'Отмена' : myLocation ? 'Изменить' : '+ Добавить'}
          </button>
        </div>

        {showLocPicker && (
          <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <LocationPicker value={locDraft} onChange={setLocDraft} />
            <button className="btn-primary" onClick={saveLocation} style={{ marginTop: 14 }}>
              Сохранить локацию
            </button>
          </div>
        )}

        {myLocation && !showLocPicker && <LocationCard location={{ ...myLocation, businessName: myLocation.business_name }} />}

        {!myLocation && !showLocPicker && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: 13 }}>
            Добавьте адрес вашего кафе или ресторана — гости смогут найти вас в 2ГИС
          </div>
        )}
      </div>

      <div className="flex sticky top-0 z-10" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid var(--border)' }}>
        {[['recipes', Grid3X3], ['liked', Heart], ['saved', Bookmark]].map(([t, Icon]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === t ? '1.5px solid var(--orange)' : '1.5px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit'
          }}>
            <Icon size={22} color={tab === t ? 'var(--orange)' : 'var(--text3)'} />
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
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

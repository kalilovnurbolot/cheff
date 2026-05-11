import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getSuggestedUsers, getPopularRecipes } from '../lib/api'

export default function RightPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [suggested, setSuggested] = useState([])
  const [popular,   setPopular]   = useState([])

  useEffect(() => {
    if (!user?.supabaseId) return
    getSuggestedUsers(user.supabaseId, 5).then(setSuggested)
    getPopularRecipes(4).then(setPopular)
  }, [user?.supabaseId])

  return (
    <aside className="right-panel">

      {/* Mini-profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div
          onClick={() => navigate('/profile')}
          style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
            border: '1.5px solid var(--border)' }}
        >
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: 'var(--bg4)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--text3)' }}>
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'chef'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || ''}
          </div>
        </div>
        <button onClick={() => navigate('/profile')}
          style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: 'none',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
          Профиль
        </button>
      </div>

      {/* Suggested users */}
      {suggested.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)' }}>Рекомендуем</span>
            <button onClick={() => navigate('/search')}
              style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', background: 'none',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Все
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {suggested.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  onClick={() => navigate('/profile/' + u.id)}
                  style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    cursor: 'pointer', border: '1px solid var(--border)' }}
                >
                  {u.avatar_url
                    ? <img src={u.avatar_url} alt={u.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--bg4)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text3)' }}>
                        {u.username?.[0]?.toUpperCase() || '?'}
                      </div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div onClick={() => navigate('/profile/' + u.id)}
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.username}
                  </div>
                  {u.full_name && (
                    <div style={{ fontSize: 12, color: 'var(--text3)', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.full_name}
                    </div>
                  )}
                </div>
                <button onClick={() => navigate('/profile/' + u.id)}
                  style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                  Читать
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular recipes */}
      {popular.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)', marginBottom: 12 }}>
            Популярное
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {popular.map(r => (
              <div key={r.id} onClick={() => navigate('/recipe/' + r.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                  background: 'var(--bg4)' }}>
                  {r.image_url && <img src={r.image_url} alt={r.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Heart size={11} /> {r.likes_count || 0} · @{r.author?.username}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 28, fontSize: 11, color: 'var(--text3)', lineHeight: 1.7 }}>
        © 2025 Cheff
      </div>
    </aside>
  )
}

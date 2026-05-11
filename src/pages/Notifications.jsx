import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react'
import { getNotifications, markAllRead } from '../lib/api'
import { useRealtimeQuery } from '../hooks/useRealtimeQuery'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

function timeAgo(ts) {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true, locale: ru }) } catch { return '' }
}

const TYPE_ICON = {
  like:    { icon: Heart,          color: '#FF3040' },
  comment: { icon: MessageCircle,  color: '#3897f0' },
  follow:  { icon: UserPlus,       color: '#4ade80' },
  reply:   { icon: MessageCircle,  color: '#FF6B35' },
}

export default function Notifications() {
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const userId      = user?.supabaseId

  const { data: notifs, error } = useRealtimeQuery(
    () => getNotifications(userId),
    'notifications',
    userId ? `user_id=eq.${userId}` : null,
    [userId]
  )

  useEffect(() => {
    if (userId) markAllRead(userId).catch(() => {})
  }, [userId])

  return (
    <Layout>
      <div style={{
        padding: `calc(var(--safe-top) + 10px) 16px 12px`,
        borderBottom: '0.5px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)'
      }}>
        <span style={{ fontSize: 17, fontWeight: 800 }}>Уведомления</span>
      </div>

      {error && (
        <div style={{ padding: '20px 16px', color: 'var(--red)', fontSize: 13 }}>
          Ошибка: {error.message}
        </div>
      )}

      {(!notifs || notifs.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text3)' }}>
          <Bell size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)' }}>Пока нет уведомлений</p>
          <p style={{ fontSize: 13 }}>Публикуйте рецепты и взаимодействуйте с аудиторией</p>
        </div>
      ) : (
        <div>
          {notifs.map((n, i) => {
            const { icon: Icon, color } = TYPE_ICON[n.type] || TYPE_ICON.like
            const fromUser = n.from_user || {}
            return (
              <div
                key={n.id || i}
                onClick={() => n.recipe_id && navigate('/recipe/' + n.recipe_id)}
                className="fade-in"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: '0.5px solid var(--border)',
                  background: n.read ? 'transparent' : 'rgba(255,107,53,0.04)',
                  cursor: n.recipe_id ? 'pointer' : 'default',
                  transition: 'background 0.15s'
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg3)' }}>
                    <img src={fromUser.avatar_url} alt={fromUser.username}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 20, height: 20, borderRadius: '50%',
                    background: color, border: '2px solid var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={10} color="#fff" fill={n.type === 'like' ? '#fff' : 'none'} />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                    <strong>{fromUser.username}</strong>
                    {' '}
                    <span style={{ color: 'var(--text2)' }}>{n.text}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                    {timeAgo(n.created_at)}
                  </div>
                </div>

                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}

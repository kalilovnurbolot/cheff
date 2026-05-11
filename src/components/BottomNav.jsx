import { NavLink } from 'react-router-dom'
import { Home, Search, PlusSquare, Bell, Download } from 'lucide-react'
import { useRealtimeQuery } from '../hooks/useRealtimeQuery'
import { getUnreadCount } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const TABS = [
  { to: '/',               key: 'home',   icon: Home,       label: 'Главная' },
  { to: '/search',         key: 'search', icon: Search,     label: 'Поиск' },
  { to: '/create',         key: 'create', icon: PlusSquare, label: 'Создать', pill: true },
  { to: '/notifications',  key: 'notifs', icon: Bell,       label: 'Активность', badge: true },
  { to: '/profile',        key: 'profile',icon: null,       label: 'Профиль', avatar: true },
]

export default function BottomNav() {
  const { user }  = useAuth()
  const userId    = user?.supabaseId
  const { canInstall, install } = useInstallPrompt()

  const { data: unreadCount } = useRealtimeQuery(
    () => getUnreadCount(userId),
    'notifications',
    userId ? `user_id=eq.${userId}` : null,
    [userId]
  )

  return (
    <>
      {canInstall && (
        <button onClick={install} className="install-btn">
          <Download size={14} /> <span className="nav-item-label" style={{ fontSize: 13, marginTop: 0 }}>Установить приложение</span>
        </button>
      )}
    <nav className="bottom-nav" style={{
      position: 'fixed', bottom: 0, left: 0,
      width: '100%', zIndex: 50,
      height: `calc(49px + var(--safe-bot))`,
    }}>
      <div className="bottom-nav-inner" style={{
        maxWidth: 430, margin: '0 auto',
        display: 'flex', alignItems: 'stretch',
        height: '100%',
      }}>
      {TABS.map(({ to, key, icon: Icon, label, pill, badge, avatar }) => (
        <NavLink
          key={key}
          to={to}
          end={to === '/'}
          style={{ flex: 1, textDecoration: 'none' }}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-45'}`
          }
        >
          {({ isActive }) => (
            <div className="nav-sidebar-item" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>

              {pill && (
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: isActive ? 'var(--orange)' : 'var(--bg4)',
                  border: isActive ? 'none' : '0.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>
                  <Icon size={20} color={isActive ? '#fff' : 'var(--text2)'} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
              )}

              {avatar && user?.avatar && (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', overflow: 'hidden',
                  border: isActive ? '2px solid var(--orange)' : '1.5px solid var(--border)',
                  transition: 'border-color 0.2s',
                }}>
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {avatar && !user?.avatar && (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--bg4)', border: isActive ? '2px solid var(--orange)' : '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: 'var(--text2)',
                }}>
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}

              {!pill && !avatar && (
                <Icon size={24} color={isActive ? 'var(--text)' : 'var(--text3)'} strokeWidth={isActive ? 2.2 : 1.8} />
              )}

              {badge && (unreadCount || 0) > 0 && (
                <div style={{
                  position: 'absolute', top: -3, right: -5,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: '#FF3040', border: '1.5px solid var(--bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#fff', padding: '0 3px',
                }}>
                  {(unreadCount || 0) > 9 ? '9+' : unreadCount}
                </div>
              )}

              <span className="nav-item-label" style={{ fontSize: 10, color: isActive ? 'var(--text)' : 'var(--text3)', lineHeight: 1, marginTop: 1 }}>
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
      </div>
    </nav>
    </>
  )
}

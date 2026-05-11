import { useEffect, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { GOOGLE_CLIENT_ID } from '../config'

const DEMO_RECIPES = [
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=300&fit=crop&q=80',
]

const isConfigured = GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE'

export default function SignIn() {
  const { signIn, isAuth, syncing } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true })
  }, [isAuth, navigate])

  async function handleSuccess(credentialResponse) {
    await signIn(credentialResponse)
    navigate('/', { replace: true })
  }

  return (
    <div style={{
      height: '100dvh', background: '#000',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Background mosaic */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        opacity: 0.18, zIndex: 0,
      }}>
        {[...DEMO_RECIPES, ...DEMO_RECIPES].map((src, i) => (
          <div key={i} style={{ overflow: 'hidden', aspectRatio: '1/1' }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95) 100%)'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {/* Chef hat icon */}
          <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>👨‍🍳</div>

          <h1 style={{
            fontSize: 52, fontWeight: 900, letterSpacing: -2,
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF3CAC 60%, #784BA0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', margin: 0, lineHeight: 1,
          }}>
            cheff
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginTop: 10, letterSpacing: 0.3 }}>
            Готовь. Делись. Вдохновляй.
          </p>
        </div>

        {/* Google sign-in */}
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {syncing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '3px solid rgba(255,107,53,0.2)',
                borderTopColor: 'var(--orange)',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Подключаемся...</p>
            </div>
          ) : isConfigured ? (
            <>
              <div style={{ width: '100%' }}>
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => console.error('Google sign-in failed')}
                  theme="filled_black"
                  size="large"
                  width="320"
                  shape="pill"
                  text="signin_with"
                  locale="ru"
                />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.6 }}>
                Входя, вы соглашаетесь с условиями использования.<br/>Данные не передаются третьим лицам.
              </p>
            </>
          ) : (
            <DevSignIn onSignIn={handleSuccess} />
          )}
        </div>
      </div>

      {/* Bottom safe area */}
      <div style={{ height: 'var(--safe-bot)', position: 'relative', zIndex: 2 }} />
    </div>
  )
}

/* ── Dev mode: bypass when Client ID not set ── */
function DevSignIn({ onSignIn }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: 'rgba(255,107,53,0.12)',
        border: '1px solid rgba(255,107,53,0.35)',
        borderRadius: 14, padding: '14px 16px',
        fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7
      }}>
        <div style={{ fontWeight: 700, color: '#FF6B35', marginBottom: 6 }}>⚙️ Настройка Google Auth</div>
        <ol style={{ paddingLeft: 18, margin: 0 }}>
          <li>Открой <strong style={{ color: 'white' }}>console.cloud.google.com</strong></li>
          <li>APIs &amp; Services → Credentials → OAuth 2.0</li>
          <li>Скопируй Client ID в <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: 4 }}>.env</code></li>
        </ol>
      </div>

      <button
        onClick={() => onSignIn({
          credential: btoa(JSON.stringify({ alg: 'RS256' })) + '.' +
            btoa(JSON.stringify({
              sub: 'demo_user_001',
              name: 'Демо Пользователь',
              email: 'demo@cheff.app',
              picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
            })) + '.signature'
        })}
        style={{
          width: '100%', padding: '15px 0', borderRadius: 28,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          backdropFilter: 'blur(10px)',
        }}
      >
        <span style={{ fontSize: 18 }}>🚀</span> Войти как демо
      </button>

      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        Только для разработки
      </p>
    </div>
  )
}

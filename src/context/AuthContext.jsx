import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { upsertProfile } from '../lib/api'

const STORAGE_KEY = 'cheff_user'

function parseGoogleJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(payload).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(loadStored)
  const [syncing, setSyncing] = useState(false)

  // Re-sync Supabase profile on app start if we have a cached user
  useEffect(() => {
    const cached = loadStored()
    if (cached?.googleId && !cached?.supabaseId) {
      syncToSupabase(cached)
    }
  }, [])

  async function syncToSupabase(profile) {
    try {
      setSyncing(true)
      const sb = await upsertProfile({
        google_id:  profile.googleId,
        username:   profile.username,
        full_name:  profile.name,
        avatar_url: profile.avatar,
        email:      profile.email,
      })
      const updated = { ...profile, supabaseId: sb.id }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setUser(updated)
      return updated
    } catch (e) {
      console.warn('[Auth] Supabase sync failed:', e.message)
      return profile
    } finally {
      setSyncing(false)
    }
  }

  const signIn = useCallback(async (credentialResponse) => {
    const decoded = parseGoogleJwt(credentialResponse.credential)
    if (!decoded) return

    const profile = {
      googleId:   decoded.sub,
      name:       decoded.name,
      email:      decoded.email,
      avatar:     decoded.picture,
      username:   decoded.name?.split(' ')[0]?.toLowerCase() || 'user',
      credential: credentialResponse.credential,
      signedInAt: Date.now(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))

    // Ждём синхронизацию — setUser вызывается внутри с supabaseId
    const result = await syncToSupabase(profile)

    // Если Supabase не настроен — всё равно пускаем в приложение
    if (!result.supabaseId) setUser(profile)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect()
  }, [])

  return (
    <AuthCtx.Provider value={{ user, signIn, signOut, syncing, isAuth: !!user }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)

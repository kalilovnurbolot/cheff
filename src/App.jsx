import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GOOGLE_CLIENT_ID } from './config'
import Feed from './pages/Feed'
import Search from './pages/Search'
import Create from './pages/Create'
import Saved from './pages/Saved'
import Profile from './pages/Profile'
import RecipeDetail from './pages/RecipeDetail'
import Notifications from './pages/Notifications'
import SignIn from './pages/SignIn'
import UserProfile from './pages/UserProfile'
import EditRecipe from './pages/EditRecipe'
import OfflineBanner from './components/OfflineBanner'
import { startSyncListener } from './lib/syncQueue'

function RequireAuth({ children }) {
  const { isAuth } = useAuth()
  const location   = useLocation()
  if (!isAuth) return <Navigate to="/signin" state={{ from: location }} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/"              element={<RequireAuth><Feed /></RequireAuth>} />
      <Route path="/search"        element={<RequireAuth><Search /></RequireAuth>} />
      <Route path="/create"        element={<RequireAuth><Create /></RequireAuth>} />
      <Route path="/saved"         element={<RequireAuth><Saved /></RequireAuth>} />
      <Route path="/profile"       element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
      <Route path="/recipe/:id"    element={<RequireAuth><RecipeDetail /></RequireAuth>} />
      <Route path="/profile/:id"   element={<RequireAuth><UserProfile /></RequireAuth>} />
      <Route path="/recipe/:id/edit" element={<RequireAuth><EditRecipe /></RequireAuth>} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  )
}

startSyncListener()

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastProvider>
          <OfflineBanner />
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

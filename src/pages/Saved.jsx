import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Clock, Trash2, WifiOff } from 'lucide-react'
import { getSavedRecipes, toggleSave } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Layout from '../components/Layout'

export default function Saved() {
  const navigate        = useNavigate()
  const toast           = useToast()
  const { user }        = useAuth()
  const userId          = user?.supabaseId

  const [recipes,  setRecipes]  = useState([])
  const [loading,  setLoading]  = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    try { setRecipes(await getSavedRecipes(userId)) }
    finally { setLoading(false) }
  }, [userId])

  useEffect(() => { load() }, [load])

  async function unsave(recipeId, e) {
    e.stopPropagation()
    setRecipes(prev => prev.filter(r => r.id !== recipeId))
    try {
      await toggleSave(recipeId, userId)
      toast('Удалено из сохранённых')
    } catch {
      load()
    }
  }

  return (
    <Layout>
      <div style={{
        padding: `calc(var(--safe-top) + 10px) 16px 12px`,
        borderBottom: '0.5px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)'
      }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 17, fontWeight: 800 }}>Сохранённые</span>
          <span style={{ background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '2px 8px', fontSize: 12, color: 'var(--text3)' }}>
            {recipes.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1" style={{ fontSize: 12, color: 'var(--green)' }}>
          <WifiOff size={11} />
          <span>Доступны офлайн</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text3)' }}>
          <span style={{ fontSize: 32 }}>⏳</span>
        </div>
      ) : recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text3)' }}>
          <Bookmark size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)', marginBottom: 4 }}>Нет сохранённых рецептов</p>
          <p style={{ fontSize: 13 }}>Нажмите на закладку в ленте</p>
        </div>
      ) : (
        <div style={{ padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recipes.map(r => (
            <div
              key={r.id}
              onClick={() => navigate('/recipe/' + r.id)}
              className="recipe-card"
              style={{ display: 'flex', gap: 12, background: 'var(--bg3)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '0.5px solid var(--border)' }}
            >
              <div style={{ width: 88, height: 88, flexShrink: 0 }}>
                <img src={r.image_url} alt={r.title}
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {r.cook_time} · {r.difficulty}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {(r.tags || []).slice(0, 2).map(t => (
                    <span key={t} className="tag" style={{ fontSize: 11, padding: '2px 8px' }}>#{t}</span>
                  ))}
                </div>
              </div>
              <button onClick={e => unsave(r.id, e)} className="btn-ghost"
                      style={{ padding: '0 14px', flexShrink: 0 }}>
                <Trash2 size={17} color="var(--red)" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

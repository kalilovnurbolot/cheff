import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, X, Clock, Flame } from 'lucide-react'
import { searchRecipes } from '../lib/api'
import Layout from '../components/Layout'

const CATEGORIES = ['Все', 'Быстро', 'Мясо', 'Вегетарианское', 'Суп', 'Завтрак', 'Паста', 'Праздничное']

export default function Search() {
  const navigate = useNavigate()
  const [query,       setQuery]       = useState('')
  const [ingredients, setIngredients] = useState('')
  const [category,    setCategory]    = useState('Все')
  const [mode,        setMode]        = useState('text')
  const [results,     setResults]     = useState([])
  const [loading,     setLoading]     = useState(false)
  const debounce = useRef(null)

  useEffect(() => {
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      setLoading(true)
      try {
        const tags = category !== 'Все' ? [category.toLowerCase()] : []
        const ings = mode === 'ingredient' && ingredients.trim()
          ? ingredients.split(',').map(s => s.trim()).filter(Boolean)
          : []
        const q = mode === 'text' ? query.trim() : ''
        const data = await searchRecipes({ query: q, tags, ingredients: ings })
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(debounce.current)
  }, [query, ingredients, category, mode])

  return (
    <Layout>
      <div className="px-4 pt-4 pb-2 sticky top-0 z-10" style={{ background: 'var(--bg)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Поиск рецептов</h1>

        <div className="flex gap-2 mb-3">
          <button onClick={() => setMode('text')} className={`tag ${mode === 'text' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center', padding: '8px 0' }}>
            По названию
          </button>
          <button onClick={() => setMode('ingredient')} className={`tag ${mode === 'ingredient' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center', padding: '8px 0' }}>
            По ингредиентам
          </button>
        </div>

        {mode === 'text' ? (
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <SearchIcon size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
                   placeholder="Паста, суп, бешбармак..."
                   style={{ paddingLeft: 42, paddingRight: query ? 42 : 16 }} />
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} color="var(--text3)" />
              </button>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: 12 }}>
            <input value={ingredients} onChange={e => setIngredients(e.target.value)}
                   placeholder="Введите ингредиенты через запятую: яйца, бекон, паста" />
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6, paddingLeft: 4 }}>
              Найдём рецепты, которые содержат ВСЕ указанные ингредиенты
            </p>
          </div>
        )}

        <div className="flex gap-2 scroll-area" style={{ overflowX: 'auto', paddingBottom: 8 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`tag ${category === cat ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 16px 20px' }}>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>
          {loading ? 'Поиск...' : `Найдено: ${results.length} рецептов`}
        </div>

        {!loading && results.length === 0 ? (
          <div className="flex flex-col items-center" style={{ paddingTop: 60, gap: 12, color: 'var(--text3)' }}>
            <SearchIcon size={40} />
            <p style={{ fontSize: 15 }}>Рецепты не найдены</p>
            <p style={{ fontSize: 13 }}>Попробуйте изменить запрос</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {results.map(r => (
              <RecipeCard key={r.id} recipe={r} onClick={() => navigate('/recipe/' + r.id)} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function RecipeCard({ recipe, onClick }) {
  return (
    <div onClick={onClick} className="recipe-card" style={{
      background: 'var(--bg3)', borderRadius: 16,
      overflow: 'hidden', cursor: 'pointer',
      border: '1px solid var(--border)'
    }}>
      <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
        <img src={recipe.image_url} alt={recipe.title}
             style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          borderRadius: 8, padding: '3px 8px', fontSize: 11, color: 'white',
          display: 'flex', alignItems: 'center', gap: 3
        }}>
          <Flame size={10} color="var(--orange)" /> {recipe.difficulty}
        </div>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 6, color: 'var(--text)' }}>
          {recipe.title}
        </div>
        <div className="flex items-center gap-2" style={{ color: 'var(--text3)', fontSize: 11 }}>
          <Clock size={11} /> {recipe.cook_time}
        </div>
      </div>
    </div>
  )
}

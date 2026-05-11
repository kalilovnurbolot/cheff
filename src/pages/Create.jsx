import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Camera, Clock, Users, X } from 'lucide-react'
import { createRecipe, upsertLocation } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Layout from '../components/Layout'
import LocationPicker from '../components/LocationPicker'

const DIFFICULTIES = ['Легко', 'Средне', 'Сложно']
const COOK_TIMES   = ['5 мин', '10 мин', '20 мин', '30 мин', '45 мин', '1ч', '1ч 30мин', '2ч', '3ч+']

export default function Create() {
  const navigate  = useNavigate()
  const toast     = useToast()
  const { user }  = useAuth()
  const userId    = user?.supabaseId

  const [section,     setSection]     = useState('basic')
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [image,       setImage]       = useState('')
  const [cookTime,    setCookTime]    = useState('30 мин')
  const [difficulty,  setDifficulty]  = useState('Средне')
  const [servings,    setServings]    = useState(4)
  const [tags,        setTags]        = useState([])
  const [tagInput,    setTagInput]    = useState('')
  const [ingredients, setIngredients] = useState([])
  const [ingInput,    setIngInput]    = useState('')
  const [steps,       setSteps]       = useState([{ text: '', duration: 5 }])
  const [location,    setLocation]    = useState(null)
  const [saving,      setSaving]      = useState(false)

  function addTag()           { const t = tagInput.trim(); if (t && !tags.includes(t)) { setTags(p => [...p, t]); setTagInput('') } }
  function removeTag(t)       { setTags(p => p.filter(x => x !== t)) }
  function addIng()           { const i = ingInput.trim(); if (i) { setIngredients(p => [...p, i]); setIngInput('') } }
  function removeIng(i)       { setIngredients(p => p.filter((_, idx) => idx !== i)) }
  function addStep()          { setSteps(p => [...p, { text: '', duration: 5 }]) }
  function removeStep(i)      { setSteps(p => p.filter((_, idx) => idx !== i)) }
  function updateStep(i, k, v){ setSteps(p => p.map((s, idx) => idx === i ? { ...s, [k]: v } : s)) }

  async function publish() {
    if (!title.trim())                    { toast('Введите название', 'error'); return }
    if (!userId)                          { toast('Необходимо войти', 'error'); return }
    if (steps.every(s => !s.text.trim())) { toast('Добавьте хотя бы один шаг', 'error'); return }
    setSaving(true)
    try {
      let location_id = null
      if (location?.businessName) {
        const loc = await upsertLocation({
          user_id:       userId,
          business_name: location.businessName,
          address:       location.address  || '',
          phone:         location.phone    || '',
          hours:         location.hours    || '',
          website:       location.website  || '',
          lat:           location.lat      || null,
          lng:           location.lng      || null,
          category:      location.category || 'Ресторан',
        })
        location_id = loc.id
      }

      const rec = await createRecipe({
        author_id:   userId,
        title:       title.trim(),
        description: description.trim(),
        image_url:   image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80',
        tags,
        ingredients,
        steps:       steps.filter(s => s.text.trim()),
        cook_time:   cookTime,
        difficulty,
        servings:    Number(servings),
        location_id,
      })

      toast('Рецепт опубликован! 🎉', 'success')
      navigate('/recipe/' + rec.id)
    } catch (e) {
      toast('Ошибка при публикации: ' + e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const SECTIONS = [{ id: 'basic', label: 'Основное' }, { id: 'ingredients', label: 'Состав' }, { id: 'steps', label: 'Шаги' }]

  return (
    <Layout hideNav>
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid var(--border)',
        padding: `calc(var(--safe-top) + 8px) 16px 10px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: 4 }}>
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Новый рецепт</span>
        <button onClick={publish} disabled={saving} style={{
          background: 'var(--orange)', border: 'none', borderRadius: 10,
          color: '#fff', padding: '8px 16px', fontWeight: 700, fontSize: 14,
          cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'inherit'
        }}>
          {saving ? '...' : 'Опубликовать'}
        </button>
      </div>

      <div className="flex" style={{ borderBottom: '0.5px solid var(--border)' }}>
        {SECTIONS.map(({ id, label }) => (
          <button key={id} onClick={() => setSection(id)} style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            color: section === id ? 'var(--orange)' : 'var(--text3)', fontWeight: section === id ? 700 : 400,
            fontSize: 13, borderBottom: section === id ? '2px solid var(--orange)' : '2px solid transparent',
            transition: 'color 0.18s', fontFamily: 'inherit'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {section === 'basic' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Camera size={13} /> Фото (URL или оставьте пустым)
              </label>
              <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
              {image && (
                <div style={{ marginTop: 8, borderRadius: 12, overflow: 'hidden', aspectRatio: '1/1' }}>
                  <img src={image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6, display: 'block' }}>Название *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Вкусный борщ с пампушками" />
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6, display: 'block' }}>Описание</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                        placeholder="Расскажите о блюде..."
                        style={{ minHeight: 80, resize: 'none', lineHeight: 1.55 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> Время
                </label>
                <select value={cookTime} onChange={e => setCookTime(e.target.value)}
                        style={{ background: 'var(--bg4)', color: 'var(--text)' }}>
                  {COOK_TIMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={12} /> Порций
                </label>
                <input type="number" min={1} max={50} value={servings} onChange={e => setServings(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8, display: 'block' }}>Сложность</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => setDifficulty(d)} className={`tag ${difficulty === d ? 'active' : ''}`}
                          style={{ flex: 1, textAlign: 'center', padding: '11px 0', fontFamily: 'inherit' }}>{d}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8, display: 'block' }}>Теги</label>
              <div className="flex gap-2 mb-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                       placeholder="Добавить тег..." style={{ flex: 1 }} />
                <button onClick={addTag} style={{
                  background: 'var(--orange)', border: 'none', borderRadius: 12,
                  color: '#fff', padding: '0 18px', fontWeight: 700, cursor: 'pointer', fontSize: 20, fontFamily: 'inherit'
                }}>+</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {tags.map(t => (
                  <span key={t} className="tag" style={{ display: 'flex', alignItems: 'center', gap: 5 }} onClick={() => removeTag(t)}>
                    {t} <X size={11} />
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 16 }}>
              <LocationPicker value={location} onChange={setLocation} />
            </div>

            <button className="btn-primary" onClick={() => setSection('ingredients')}>
              Далее: Ингредиенты →
            </button>
          </div>
        )}

        {section === 'ingredients' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="flex gap-2">
              <input value={ingInput} onChange={e => setIngInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIng())}
                     placeholder="Например: баранина 1кг" style={{ flex: 1 }} />
              <button onClick={addIng} style={{
                background: 'var(--orange)', border: 'none', borderRadius: 12,
                color: '#fff', padding: '0 18px', fontWeight: 700, cursor: 'pointer', fontSize: 20, fontFamily: 'inherit'
              }}>+</button>
            </div>

            {ingredients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
                <Plus size={32} style={{ marginBottom: 8 }} />
                <p>Добавьте ингредиенты</p>
              </div>
            ) : (
              ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between"
                     style={{ background: 'var(--bg3)', borderRadius: 12, padding: '13px 16px', border: '0.5px solid var(--border)' }}>
                  <span style={{ fontSize: 15 }}>{ing}</span>
                  <button onClick={() => removeIng(i)} className="btn-ghost" style={{ padding: 4 }}>
                    <Trash2 size={16} color="var(--red)" />
                  </button>
                </div>
              ))
            )}

            <button className="btn-primary" onClick={() => setSection('steps')}>
              Далее: Шаги приготовления →
            </button>
          </div>
        )}

        {section === 'steps' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 16, padding: 16, border: '0.5px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Шаг {i + 1}
                  </span>
                  {steps.length > 1 && (
                    <button onClick={() => removeStep(i)} className="btn-ghost" style={{ padding: 4 }}>
                      <Trash2 size={15} color="var(--red)" />
                    </button>
                  )}
                </div>
                <textarea value={step.text} onChange={e => updateStep(i, 'text', e.target.value)}
                          placeholder="Опишите этот шаг..."
                          style={{ minHeight: 72, resize: 'none', marginBottom: 12, lineHeight: 1.55 }} />
                <div className="flex items-center gap-3">
                  <Clock size={14} color="var(--text3)" />
                  <span style={{ fontSize: 13, color: 'var(--text3)' }}>Таймер (мин):</span>
                  <input type="number" min={0} max={180} value={step.duration}
                         onChange={e => updateStep(i, 'duration', Number(e.target.value))}
                         style={{ width: 70, textAlign: 'center' }} />
                </div>
              </div>
            ))}

            <button onClick={addStep} style={{
              background: 'none', border: '1.5px dashed var(--border)', borderRadius: 16,
              color: 'var(--text3)', padding: '16px 0', cursor: 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit'
            }}>
              <Plus size={18} /> Добавить шаг
            </button>

            <button className="btn-primary" onClick={publish} disabled={saving}>
              {saving ? 'Публикуем...' : 'Опубликовать рецепт 🚀'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

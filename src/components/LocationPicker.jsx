import { useState } from 'react'
import { MapPin, Navigation, X } from 'lucide-react'

export default function LocationPicker({ value, onChange }) {
  const [detecting, setDetecting] = useState(false)

  async function detectGeo() {
    if (!navigator.geolocation) return alert('Геолокация недоступна')
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        onChange({ ...value, lat: pos.coords.latitude, lng: pos.coords.longitude })
        setDetecting(false)
      },
      () => { setDetecting(false); alert('Не удалось определить местоположение') },
      { timeout: 8000 }
    )
  }

  function update(field, val) { onChange({ ...value, [field]: val }) }

  const hasLocation = value?.businessName || value?.address

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center justify-between mb-1">
        <label style={{ fontSize: 13, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <MapPin size={13} color="var(--orange)" /> Локация заведения (необязательно)
        </label>
        {hasLocation && (
          <button onClick={() => onChange(null)} className="btn-ghost" style={{ fontSize: 12, color: 'var(--red)', padding: '2px 6px' }}>
            <X size={13} /> Убрать
          </button>
        )}
      </div>

      <input
        placeholder="Название заведения (кафе, ресторан...)"
        value={value?.businessName || ''}
        onChange={e => update('businessName', e.target.value)}
      />
      <input
        placeholder="Адрес"
        value={value?.address || ''}
        onChange={e => update('address', e.target.value)}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input
          placeholder="Телефон"
          value={value?.phone || ''}
          onChange={e => update('phone', e.target.value)}
        />
        <input
          placeholder="Часы работы"
          value={value?.hours || ''}
          onChange={e => update('hours', e.target.value)}
        />
      </div>
      <input
        placeholder="Сайт (необязательно)"
        value={value?.website || ''}
        onChange={e => update('website', e.target.value)}
      />

      <div className="flex items-center gap-3">
        <button onClick={detectGeo} disabled={detecting} className="btn-ghost"
                style={{ border: '0.5px solid var(--border)', borderRadius: 10, padding: '9px 14px', fontSize: 13, color: 'var(--text2)', flex: 1 }}>
          <Navigation size={14} /> {detecting ? 'Определяем...' : 'Моё местоположение'}
        </button>
        {value?.lat && (
          <span style={{ fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 3 }}>
            ✓ GPS получен
          </span>
        )}
      </div>

      <select value={value?.category || 'Ресторан'} onChange={e => update('category', e.target.value)}
              style={{ background: 'var(--bg4)', color: 'var(--text)' }}>
        {['Ресторан', 'Кафе', 'Кондитерская', 'Бар', 'Пекарня', 'Фастфуд', 'Другое'].map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}

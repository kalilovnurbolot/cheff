import { MapPin, Phone, Clock, Globe, Navigation } from 'lucide-react'

function open2GIS(location) {
  if (location.lat && location.lng) {
    // Try 2GIS deep link first (mobile app), fallback to web
    const deepLink = `dgis://2gis.com/routeSearch/to/${location.lat},${location.lng}/go`
    const webLink  = `https://2gis.kz/geo/${location.lng},${location.lat}`

    // Try to open app; if it doesn't open in 800ms fall back to web
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = deepLink
    document.body.appendChild(iframe)
    setTimeout(() => {
      document.body.removeChild(iframe)
      window.open(webLink, '_blank', 'noopener')
    }, 800)
  } else {
    const query = encodeURIComponent(`${location.businessName ?? location.business_name ?? ''} ${location.address ?? ''}`)
    window.open(`https://2gis.kz/search/${query}`, '_blank', 'noopener')
  }
}

export default function LocationCard({ location }) {
  if (!location) return null

  // Supabase returns snake_case; LocationPicker uses camelCase — support both
  const name = location.businessName ?? location.business_name ?? ''

  return (
    <div className="location-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <MapPin size={16} color="var(--orange)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
              {name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>{location.address}</div>
          </div>
        </div>
        <span style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--orange)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8, flexShrink: 0 }}>
          {location.category}
        </span>
      </div>

      {location.hours && (
        <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--text3)' }}>
          <Clock size={13} style={{ flexShrink: 0 }} />
          <span>{location.hours}</span>
        </div>
      )}

      {location.phone && (
        <a href={`tel:${location.phone}`} style={{ fontSize: 13, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <Phone size={13} />
          <span>{location.phone}</span>
        </a>
      )}

      {location.website && (
        <a href={location.website} target="_blank" rel="noopener noreferrer"
           style={{ fontSize: 13, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <Globe size={13} />
          <span>{location.website.replace(/^https?:\/\//, '')}</span>
        </a>
      )}

      <button className="btn-2gis" onClick={() => open2GIS(location)} style={{ alignSelf: 'flex-start' }}>
        <Navigation size={14} />
        Открыть в 2ГИС
      </button>
    </div>
  )
}

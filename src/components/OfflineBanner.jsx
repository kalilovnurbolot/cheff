import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

export default function OfflineBanner() {
  const [offline,  setOffline]  = useState(!navigator.onLine)
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    function handleOnline() {
      setOffline(false)
      setRestored(true)
      setTimeout(() => setRestored(false), 3000)
    }
    function handleOffline() {
      setOffline(true)
      setRestored(false)
    }
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!offline && !restored) return null

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: offline ? '#2a1a00' : '#0a2a0a',
      borderBottom: `1px solid ${offline ? '#553300' : '#1a4a1a'}`,
      padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 13, color: offline ? '#FFB347' : '#4CAF50',
      transition: 'background 0.3s',
    }}>
      {offline
        ? <><WifiOff size={14} /> Нет интернета — показываем сохранённые данные</>
        : <><Wifi size={14} /> Соединение восстановлено</>
      }
    </div>
  )
}

import { useState, useEffect } from 'react'
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react'
import { getPendingCount } from '../lib/syncQueue'

export default function OfflineBanner() {
  const [offline,  setOffline]  = useState(!navigator.onLine)
  const [syncing,  setSyncing]  = useState(false)
  const [synced,   setSynced]   = useState(0)
  const [pending,  setPending]  = useState(0)
  const [show,     setShow]     = useState(!navigator.onLine)

  useEffect(() => {
    async function handleOnline() {
      setOffline(false)
      setShow(true)
    }
    function handleOffline() {
      setOffline(true)
      setShow(true)
      setSyncing(false)
      setSynced(0)
      getPendingCount().then(setPending)
    }
    async function handleSyncing(e) {
      setSyncing(true)
      setSynced(0)
      setPending(e.detail.count)
    }
    async function handleSynced(e) {
      setSyncing(false)
      setSynced(e.detail.synced)
      setPending(0)
      // Скрываем баннер через 3 секунды
      setTimeout(() => setShow(false), 3000)
    }

    window.addEventListener('online',        handleOnline)
    window.addEventListener('offline',       handleOffline)
    window.addEventListener('cheff:syncing', handleSyncing)
    window.addEventListener('cheff:synced',  handleSynced)
    return () => {
      window.removeEventListener('online',        handleOnline)
      window.removeEventListener('offline',       handleOffline)
      window.removeEventListener('cheff:syncing', handleSyncing)
      window.removeEventListener('cheff:synced',  handleSynced)
    }
  }, [])

  // Обновляем счётчик при уходе в офлайн
  useEffect(() => {
    if (offline) getPendingCount().then(setPending)
  }, [offline])

  if (!show) return null

  const bg     = offline ? '#2a1a00' : syncing ? '#0a1a2a' : '#0a2a0a'
  const border = offline ? '#553300' : syncing ? '#1a3a5a' : '#1a4a1a'
  const color  = offline ? '#FFB347' : syncing ? '#64B5F6' : '#4CAF50'

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: bg, borderBottom: `1px solid ${border}`,
      padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 13, color,
      transition: 'background 0.3s',
    }}>
      {offline ? (
        <>
          <WifiOff size={14} />
          {pending > 0
            ? `Нет интернета — ${pending} ${pending === 1 ? 'изменение' : 'изменений'} в очереди`
            : 'Нет интернета — показываем сохранённые данные'
          }
        </>
      ) : syncing ? (
        <>
          <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          {`Синхронизация ${pending} изменений...`}
        </>
      ) : (
        <>
          {synced > 0
            ? <><CheckCircle2 size={14} />{`Синхронизировано ${synced} изменений ✓`}</>
            : <><Wifi size={14} />Соединение восстановлено</>
          }
        </>
      )}
    </div>
  )
}

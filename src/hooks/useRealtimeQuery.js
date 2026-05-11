import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { cacheGet, cacheSet } from '../lib/offlineCache'

export function useRealtimeQuery(fetchFn, table, filter = null, deps = []) {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  const cacheKey = filter ? `${table}:${filter}` : table

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetchFn()
      setData(result)
      setError(null)
      setIsOffline(false)
      cacheSet(cacheKey, result)
    } catch (e) {
      const cached = await cacheGet(cacheKey)
      if (cached !== null) {
        setData(cached)
        setIsOffline(true)
        setError(null)
      } else {
        setError(e)
      }
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()

    const channelName = filter ? `${table}-${filter}` : table
    const config = { event: '*', schema: 'public', table }
    if (filter) config.filter = filter

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', config, () => { if (navigator.onLine) load() })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, isOffline, reload: load }
}

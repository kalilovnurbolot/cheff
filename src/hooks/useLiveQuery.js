import { useState, useEffect } from 'react'
import { liveQuery } from 'dexie'

export function useLiveQuery(queryFn, deps = [], defaultValue = undefined) {
  const [result, setResult] = useState(defaultValue)

  useEffect(() => {
    const sub = liveQuery(queryFn).subscribe({
      next: setResult,
      error: (e) => console.error('liveQuery error:', e),
    })
    return () => sub.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return result
}

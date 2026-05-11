import { useState, useEffect, useRef, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const STORY_DURATION = 5000 // ms per story

// Each "user" gets a synthetic story from their latest recipe image
export default function StoryViewer({ stories, startIndex = 0, onClose }) {
  const [userIdx, setUserIdx]   = useState(startIndex)
  const [storyIdx, setStoryIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  const currentUser   = stories[userIdx]
  const currentStories = currentUser?.items || []
  const totalStories  = currentStories.length

  const advance = useCallback(() => {
    if (storyIdx < totalStories - 1) {
      setStoryIdx(i => i + 1)
      setProgress(0)
    } else if (userIdx < stories.length - 1) {
      setUserIdx(u => u + 1)
      setStoryIdx(0)
      setProgress(0)
    } else {
      onClose()
    }
  }, [storyIdx, totalStories, userIdx, stories.length, onClose])

  const goBack = useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx(i => i - 1)
      setProgress(0)
    } else if (userIdx > 0) {
      setUserIdx(u => u - 1)
      setStoryIdx(0)
      setProgress(0)
    }
  }, [storyIdx, userIdx])

  // Timer
  useEffect(() => {
    setProgress(0)
    startRef.current = performance.now()

    function tick(now) {
      const elapsed = now - startRef.current
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        advance()
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [storyIdx, userIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!currentUser) return null
  const item = currentStories[storyIdx]

  return (
    <div className="story-viewer" style={{ touchAction: 'none' }}>
      {/* Progress bars */}
      <div className="flex gap-1 px-3 pt-2 pb-3" style={{ position: 'absolute', top: 'var(--safe-top)', left: 0, right: 0, zIndex: 10 }}>
        {currentStories.map((_, i) => (
          <div key={i} className="progress-bar">
            <div className="progress-bar-fill" style={{ width: i < storyIdx ? '100%' : i === storyIdx ? `${progress}%` : '0%' }} />
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 px-4"
           style={{ position: 'absolute', top: `calc(var(--safe-top) + 22px)`, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid white' }}>
          <img src={currentUser.avatar} alt={currentUser.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{currentUser.username}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{item?.timeAgo}</div>
        </div>
        <button onClick={onClose} className="btn-ghost" style={{ marginLeft: 'auto', color: 'white' }}>
          <X size={24} />
        </button>
      </div>

      {/* Image */}
      <img src={item?.image} alt=""
           style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />

      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Caption */}
      {item?.caption && (
        <div style={{
          position: 'absolute', bottom: `calc(var(--safe-bot) + 40px)`, left: 20, right: 20,
          fontSize: 15, color: 'white', fontWeight: 500, textAlign: 'center',
          textShadow: '0 1px 8px rgba(0,0,0,0.8)', lineHeight: 1.5
        }}>
          {item.caption}
        </div>
      )}

      {/* Tap zones */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        <div style={{ flex: 1 }} onClick={goBack} />
        <div style={{ flex: 1 }} onClick={advance} />
      </div>
    </div>
  )
}

import { useState } from 'react'

export default function StoryRing({ user, seen = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 shrink-0"
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    >
      <div className={seen ? 'story-ring-seen' : 'story-ring'}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'var(--bg3)',
          border: '2px solid var(--bg)',
          overflow: 'hidden'
        }}>
          <img
            src={user.avatar}
            alt={user.username}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {user.username}
      </span>
    </button>
  )
}

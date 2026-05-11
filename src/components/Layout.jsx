import BottomNav from './BottomNav'
import OfflineBanner from './OfflineBanner'
import RightPanel from './RightPanel'

export default function Layout({ children, hideNav = false }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <OfflineBanner />
      <div className="layout-content-row">
        <main
          className="scroll-area layout-main"
          style={{ paddingBottom: hideNav ? 0 : 'calc(49px + var(--safe-bot))' }}
        >
          {children}
        </main>
        {!hideNav && <RightPanel />}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  )
}

import { useState } from 'react'
import GroupsPage from './pages/GroupsPage'
import BracketPage from './pages/BracketPage'

type Rankings = Record<string, string[]>

const C = {
  bg: '#0e0416',
  red: '#c8102e',
  lime: '#c8f000',
  purple: '#6b21a8',
}

export default function App() {
  const [tab, setTab] = useState<'groups' | 'bracket' | 'summary'>('groups')
  const [rankings, setRankings] = useState<Rankings>({})

  const handleGroupsComplete = (r: Rankings) => {
    setRankings(r)
    setTab('bracket')
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: C.red }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 24px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontWeight: 900, color: '#fff', fontSize: 18, letterSpacing: '0.06em' }}>
            ⚽ <span style={{ color: C.lime }}>WC26</span> PREDICTOR
          </div>
          <nav style={{ display: 'flex', gap: 4 }}>
            {(['groups', 'bracket', 'summary'] as const).map((t, i) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '6px 14px', borderRadius: 6, border: 'none',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
                background: tab === t ? 'rgba(0,0,0,0.25)' : 'transparent',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
              }}>
                {i + 1}. {t}
              </button>
            ))}
          </nav>
        </div>
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${C.red} 0%, ${C.purple} 50%, ${C.lime} 100%)`
        }} />
      </header>

      {tab === 'groups' && <GroupsPage onComplete={handleGroupsComplete} />}
      {tab === 'bracket' && <BracketPage rankings={rankings} onComplete={handleGroupsComplete} />}
      {tab === 'summary' && (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
          Summary coming next...
        </div>
      )}
    </div>
  )
}
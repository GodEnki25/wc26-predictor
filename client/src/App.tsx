import { useState } from 'react'
import GroupsPage from './pages/GroupsPage'
import ThirdPlacePage from './pages/ThirdPlacePage'
import BracketPage from './pages/BracketPage'
import SummaryPage from './pages/SummaryPage'
import AIPredictionsPage from './pages/AIPredictionsPage'

type Rankings = Record<string, string[]>
type Team = { name: string; flag: string }
type ThirdPlaceTeam = { name: string; flag: string; groupId: string }

const C = {
  bg: '#0e0416',
  red: '#c8102e',
  lime: '#c8f000',
  purple: '#6b21a8',
  white20: 'rgba(255,255,255,0.20)',
}

export default function App() {
  const [tab, setTab] = useState<'groups' | 'thirdplace' | 'bracket' | 'summary' | 'ai'>('groups')
  const [rankings, setRankings] = useState<Rankings>({})
  const [thirdPlaceTeams, setThirdPlaceTeams] = useState<ThirdPlaceTeam[]>([])
  const [champion, setChampion] = useState<Team | null>(null)

  const handleGroupsComplete = (r: Rankings) => {
    setRankings(r)
    setTab('thirdplace')
  }

  const handleThirdPlaceComplete = (teams: ThirdPlaceTeam[]) => {
    setThirdPlaceTeams(teams)
    setTab('bracket')
  }

  const handleBracketComplete = (winner: Team) => {
    setChampion(winner)
    setTab('summary')
  }

  const navItems = [
    { id: 'groups', label: 'Groups', n: 1 },
    { id: 'thirdplace', label: '3rd Place', n: 2 },
    { id: 'bracket', label: 'Bracket', n: 3 },
    { id: 'summary', label: 'Summary', n: 4 },
    { id: 'ai', label: '🤖 AI', n: 5 },
  ] as const

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
            {navItems.map(({ id, label, n }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '6px 12px', borderRadius: 6, border: 'none',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
                background: tab === id ? 'rgba(0,0,0,0.25)' : 'transparent',
                color: tab === id ? '#fff' : 'rgba(255,255,255,0.4)',
              }}>
                {n}. {label}
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
      {tab === 'thirdplace' && (
        <ThirdPlacePage rankings={rankings} onComplete={handleThirdPlaceComplete} />
      )}
      {tab === 'bracket' && (
        <BracketPage
          rankings={rankings}
          thirdPlaceTeams={thirdPlaceTeams}
          onComplete={handleBracketComplete}
        />
      )}
      {tab === 'summary' && champion && (
        <SummaryPage champion={champion} rankings={rankings} thirdPlaceTeams={thirdPlaceTeams} />
      )}
      {tab === 'summary' && !champion && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: C.white20, fontSize: 14, marginBottom: 16 }}>
            Complete the bracket first to see your summary.
          </p>
          <button onClick={() => setTab('groups')} style={{
            padding: '12px 32px', borderRadius: 8, border: 'none',
            background: `linear-gradient(135deg, ${C.red}, ${C.purple})`,
            color: '#fff', fontWeight: 900, fontSize: 13,
            letterSpacing: '0.08em', cursor: 'pointer',
          }}>
            START FROM GROUPS →
          </button>
        </div>
      )}
      {tab === 'ai' && champion && (
        <AIPredictionsPage champion={champion} rankings={rankings} />
      )}
      {tab === 'ai' && !champion && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: C.white20, fontSize: 14, marginBottom: 16 }}>
            Complete your bracket first to get AI analysis.
          </p>
          <button onClick={() => setTab('groups')} style={{
            padding: '12px 32px', borderRadius: 8, border: 'none',
            background: `linear-gradient(135deg, ${C.red}, ${C.purple})`,
            color: '#fff', fontWeight: 900, fontSize: 13,
            letterSpacing: '0.08em', cursor: 'pointer',
          }}>
            START FROM GROUPS →
          </button>
        </div>
      )}
    </div>
  )
}
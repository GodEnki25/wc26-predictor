import { useState, useEffect } from 'react'
import GroupsPage from './pages/GroupsPage'
import ThirdPlacePage from './pages/ThirdPlacePage'
import BracketPage from './pages/BracketPage'
import SummaryPage from './pages/SummaryPage'
import AIPredictionsPage from './pages/AIPredictionsPage'
import AuthModal from './components/AuthModal'
import { savePrediction } from './services/api'

type Rankings = Record<string, string[]>
type Team = { name: string; flag: string }
type ThirdPlaceTeam = { name: string; flag: string; groupId: string }
type User = { id: string; email: string; name: string }

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
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load token from localStorage on mount
  useEffect(() => {
    const t = localStorage.getItem('wc26_token')
    const u = localStorage.getItem('wc26_user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
    }
  }, [])

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

  const handleAuthSuccess = async (
    newToken: string,
    newUser: User
  ) => {
    setToken(newToken)
    setUser(newUser)
    setShowAuth(false)
    if (champion) await handleSave(newToken)
  }

  const handleSave = async (t?: string) => {
    const activeToken = t || token
    if (!activeToken) { setShowAuth(true); return }
    if (!champion) return

    setSaving(true)
    try {
      await savePrediction(activeToken, {
        champion: champion.name,
        championFlag: champion.flag,
        rankings,
        thirdPlaceTeams,
        bracketWinners: {},
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('wc26_token')
    localStorage.removeItem('wc26_user')
    setToken(null)
    setUser(null)
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

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}

{/* Header */}
<header style={{ position: 'sticky', top: 0, zIndex: 50, background: C.red }}>
  <div style={{
    maxWidth: 1280, margin: '0 auto',
    padding: '0 12px', height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 8,
  }}>
    {/* Logo */}
    <div style={{ fontWeight: 900, color: '#fff', fontSize: 16, letterSpacing: '0.06em', flexShrink: 0 }}>
      ⚽ <span style={{ color: C.lime }}>WC26</span>
    </div>

    {/* Nav tabs — scrollable on mobile */}
    <nav style={{
      display: 'flex', gap: 2, alignItems: 'center',
      overflowX: 'auto', flexShrink: 1,
      scrollbarWidth: 'none',
      // hide webkit scrollbar
      msOverflowStyle: 'none',
    }}>
      {navItems.map(({ id, label, n }) => (
        <button key={id} onClick={() => setTab(id)} style={{
          padding: '6px 10px', borderRadius: 6, border: 'none',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          cursor: 'pointer', whiteSpace: 'nowrap',
          background: tab === id ? 'rgba(0,0,0,0.25)' : 'transparent',
          color: tab === id ? '#fff' : 'rgba(255,255,255,0.5)',
          textDecoration: tab === id ? 'underline' : 'none',
          textUnderlineOffset: 3,
        }}>
          {n}. {label}
        </button>
      ))}
    </nav>

    {/* Auth — always visible, never shrinks */}
    <div style={{ flexShrink: 0 }}>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            👋 {user.name}
          </span>
          <button onClick={handleLogout} style={{
            padding: '5px 8px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent', color: 'rgba(255,255,255,0.5)',
            fontSize: 10, fontWeight: 700, cursor: 'pointer',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Out</button>
        </div>
      ) : (
        <button onClick={() => setShowAuth(true)} style={{
          padding: '6px 12px', borderRadius: 6,
          border: 'none', background: C.lime, color: '#0e0416',
          fontSize: 11, fontWeight: 900, cursor: 'pointer',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Login</button>
      )}
    </div>
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
        <SummaryPage
          champion={champion}
          rankings={rankings}
          thirdPlaceTeams={thirdPlaceTeams}
          onSave={handleSave}
          saving={saving}
          saved={saved}
          user={user}
          onGoToAI={() => setTab('ai')}
        />
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
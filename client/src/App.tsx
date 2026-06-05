import { useState } from 'react'
import GroupsPage from './pages/GroupsPage'

type Rankings = Record<string, string[]>

export default function App() {
  const [tab, setTab] = useState<'groups' | 'bracket' | 'summary'>('groups')
  const [rankings, setRankings] = useState<Rankings>({})

  const handleGroupsComplete = (r: Rankings) => {
    setRankings(r)
    setTab('bracket')
  }

  return (
    <div className="min-h-screen bg-[#0e0416]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#c8102e]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-black text-white text-lg tracking-wider">
            ⚽ <span className="text-[#c8f000]">WC26</span> PREDICTOR
          </div>
          <nav className="flex gap-1">
            {(['groups', 'bracket', 'summary'] as const).map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded text-xs font-bold tracking-wider uppercase transition-colors
                  ${tab === t
                    ? 'bg-black/25 text-white'
                    : 'text-white/40 hover:text-white/70'
                  }`}
              >
                {i + 1}. {t}
              </button>
            ))}
          </nav>
        </div>
        {/* Gradient stripe */}
        <div className="h-[3px]" style={{
          background: 'linear-gradient(90deg, #c8102e 0%, #6b21a8 50%, #c8f000 100%)'
        }} />
      </header>

      {tab === 'groups' && <GroupsPage onComplete={handleGroupsComplete} />}
      {tab === 'bracket' && (
        <div className="p-10 text-white/30 text-center text-sm">
          Bracket coming next...
        </div>
      )}
      {tab === 'summary' && (
        <div className="p-10 text-white/30 text-center text-sm">
          Summary coming next...
        </div>
      )}
    </div>
  )
}
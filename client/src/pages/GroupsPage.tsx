import { useState } from 'react'
import { GROUPS } from '../data/groups'
import GroupCard from '../components/GroupCard'

type Props = {
  onComplete: (rankings: Record<string, string[]>) => void
}

const C = {
  bg: '#0e0416',
  red: '#c8102e',
  lime: '#c8f000',
  purple: '#6b21a8',
}

export default function GroupsPage({ onComplete }: Props) {
  const [rankings, setRankings] = useState<Record<string, string[]>>({})

  const toggleRank = (groupId: string, teamName: string) => {
    setRankings(prev => {
      const current = prev[groupId] || []
      if (current.includes(teamName)) {
        return { ...prev, [groupId]: current.filter(t => t !== teamName) }
      }
      if (current.length >= 4) return prev
      return { ...prev, [groupId]: [...current, teamName] }
    })
  }

  const groupsDone = Object.keys(rankings).filter(g => rankings[g]?.length === 4).length
  const allDone = groupsDone === GROUPS.length
  const progress = (groupsDone / GROUPS.length) * 100

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 112px' }}>

      <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${C.red}, ${C.lime})`,
          borderRadius: 2,
          transition: 'width 0.5s ease',
        }} />
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '0.02em', marginBottom: 6 }}>
        PREDICT THE <span style={{ color: C.lime }}>GROUP STAGE</span>
      </h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 28 }}>
        Click teams in order to rank 1st–4th · Top 2 advance · Best 8 third-place teams also advance · {groupsDone}/{GROUPS.length} groups done
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
      }}>
        {GROUPS.map(g => (
          <GroupCard key={g.id} group={g} rankings={rankings} onToggle={toggleRank} />
        ))}
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: 24,
        background: `linear-gradient(to top, ${C.bg} 60%, transparent)`,
        display: 'flex', justifyContent: 'center',
      }}>
        <button
          disabled={!allDone}
          onClick={() => onComplete(rankings)}
          style={{
            padding: '14px 48px',
            borderRadius: 8, border: 'none',
            fontSize: 14, fontWeight: 900,
            letterSpacing: '0.1em',
            cursor: allDone ? 'pointer' : 'not-allowed',
            background: allDone
              ? `linear-gradient(135deg, ${C.red} 0%, ${C.purple} 100%)`
              : 'rgba(255,255,255,0.07)',
            color: allDone ? '#fff' : 'rgba(255,255,255,0.2)',
            boxShadow: allDone ? '0 4px 24px rgba(200,16,46,0.35)' : 'none',
            transition: 'transform 0.15s',
          }}
        >
          {allDone ? 'CONTINUE TO BRACKET →' : `COMPLETE ALL GROUPS (${groupsDone}/${GROUPS.length})`}
        </button>
      </div>
    </div>
  )
}
import { useState } from 'react' 
import { GROUPS } from '../data/groups'

type Team = { name: string; flag: string }
type Rankings = Record<string, string[]>
type ThirdPlaceTeam = { name: string; flag: string; groupId: string }

interface Props {
  rankings: Rankings
  thirdPlaceTeams: ThirdPlaceTeam[]
  onComplete: (winner: Team) => void
}

const C = {
  bg: '#0e0416',
  card: '#1a0820',
  cardHeader: '#130320',
  border: 'rgba(107,33,168,0.35)',
  borderWinner: 'rgba(200,240,0,0.4)',
  lime: '#c8f000',
  red: '#c8102e',
  purple: '#6b21a8',
  white88: 'rgba(255,255,255,0.88)',
  white20: 'rgba(255,255,255,0.20)',
  white7: 'rgba(255,255,255,0.07)',
}

// Get top 2 from each group based on user rankings
function getAdvancing(rankings: Rankings): Team[] {
  return GROUPS.flatMap(g => {
    const ranked = rankings[g.id] || []
    return ranked.slice(0, 2).map(name => {
      const team = g.teams.find(t => t.name === name)
      return team ? { name: team.name, flag: team.flag } : null
    }).filter(Boolean) as Team[]
  })
}

// Get best 8 third place teams
function getThirdPlace(rankings: Rankings): Team[] {
  return GROUPS.flatMap(g => {
    const ranked = rankings[g.id] || []
    const name = ranked[2]
    if (!name) return []
    const team = g.teams.find(t => t.name === name)
    return team ? [{ name: team.name, flag: team.flag }] : []
  }).slice(0, 8)
}

function MatchSlot({
  team1, team2, winner, onPick
}: {
  team1: Team | null
  team2: Team | null
  winner: Team | null
  onPick: (team: Team) => void
}) {
  const TeamRow = ({ team }: { team: Team | null }) => {
    if (!team) return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 10px',
        borderBottom: `1px solid ${C.border}`,
        opacity: 0.25,
      }}>
        <span style={{ fontSize: 11, color: C.white20 }}>TBD</span>
      </div>
    )

    const isWinner = winner?.name === team.name
    const isLoser = winner && winner.name !== team.name

    return (
      <div
        onClick={() => onPick(team)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 10px',
          borderBottom: `1px solid ${C.border}`,
          background: isWinner ? 'rgba(200,240,0,0.08)' : 'transparent',
          opacity: isLoser ? 0.35 : 1,
          cursor: team ? 'pointer' : 'default',
          transition: 'all 0.15s',
        }}
      >
        <span style={{ fontSize: 13 }}>{team.flag}</span>
        <span style={{
          fontSize: 11, fontWeight: 500, flex: 1,
          color: isWinner ? C.lime : C.white88,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          maxWidth: 80,
        }}>{team.name}</span>
        {isWinner && <span style={{ fontSize: 9, color: C.lime, fontWeight: 800 }}>✓</span>}
      </div>
    )
  }

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${winner ? C.borderWinner : C.border}`,
      borderRadius: 8,
      overflow: 'hidden',
      minWidth: 130,
    }}>
      <TeamRow team={team1} />
      <div style={{ borderBottom: 'none' }}>
        <TeamRow team={team2} />
      </div>
    </div>
  )
}

function RoundColumn({
  title, matches, winners, onPick, spacing = 0
}: {
  title: string
  matches: { id: string; team1: Team | null; team2: Team | null }[]
  winners: Record<string, Team>
  onPick: (matchId: string, team: Team) => void
  spacing?: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 145 }}>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: C.lime,
        textAlign: 'center', padding: '8px 0 12px',
        borderBottom: `1px solid ${C.border}`,
        marginBottom: 12, whiteSpace: 'nowrap',
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {matches.map((m, i) => (
          <div key={m.id} style={{ marginTop: i === 0 ? spacing : spacing * 2 }}>
            <MatchSlot
              team1={m.team1}
              team2={m.team2}
              winner={winners[m.id] || null}
              onPick={(team) => onPick(m.id, team)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BracketPage({ rankings, thirdPlaceTeams, onComplete }: Props) {
  const [winners, setWinners] = useState<Record<string, Team>>({})

  const pickWinner = (matchId: string, team: Team) => {
    setWinners(prev => ({ ...prev, [matchId]: team }))
  }

  // Build all 32 teams
  const advancing = getAdvancing(rankings)
  const thirdPlace = getThirdPlace(rankings)
  const allTeams = [...advancing, ...thirdPlace, ...thirdPlaceTeams].slice(0, 32)

  // Round of 32 — 16 matches
  const r32 = Array.from({ length: 16 }, (_, i) => ({
    id: `r32-${i}`,
    team1: allTeams[i * 2] || null,
    team2: allTeams[i * 2 + 1] || null,
  }))

  // Round of 16 — 8 matches
  const r16 = Array.from({ length: 8 }, (_, i) => ({
    id: `r16-${i}`,
    team1: winners[r32[i * 2].id] || null,
    team2: winners[r32[i * 2 + 1].id] || null,
  }))

  // Quarter Finals — 4 matches
  const qf = Array.from({ length: 4 }, (_, i) => ({
    id: `qf-${i}`,
    team1: winners[r16[i * 2].id] || null,
    team2: winners[r16[i * 2 + 1].id] || null,
  }))

  // Semi Finals — 2 matches
  const sf = Array.from({ length: 2 }, (_, i) => ({
    id: `sf-${i}`,
    team1: winners[qf[i * 2].id] || null,
    team2: winners[qf[i * 2 + 1].id] || null,
  }))

  // Final
  const final = {
    id: 'final',
    team1: winners['sf-0'] || null,
    team2: winners['sf-1'] || null,
  }

  const champion = winners['final'] || null

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 112px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
        KNOCKOUT <span style={{ color: C.lime }}>BRACKET</span>
      </h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>
        Click the team you think will win each match · picks cascade forward automatically
      </p>

      {/* Champion display */}
      {champion && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(200,240,0,0.1), rgba(200,240,0,0.04))',
          border: `2px solid rgba(200,240,0,0.4)`,
          borderRadius: 14, padding: '20px 28px',
          display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 28,
          boxShadow: '0 0 40px rgba(200,240,0,0.1)',
        }}>
          <span style={{ fontSize: 48 }}>🏆</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: C.lime, marginBottom: 4 }}>
              YOUR WORLD CUP 2026 CHAMPION
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>{champion.flag}</span> {champion.name}
            </div>
          </div>
        </div>
      )}

      {/* Bracket scroll */}
      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 900 }}>
          <RoundColumn title="Round of 32" matches={r32} winners={winners} onPick={pickWinner} spacing={0} />
          <RoundColumn title="Round of 16" matches={r16} winners={winners} onPick={pickWinner} spacing={20} />
          <RoundColumn title="Quarter Finals" matches={qf} winners={winners} onPick={pickWinner} spacing={60} />
          <RoundColumn title="Semi Finals" matches={sf} winners={winners} onPick={pickWinner} spacing={140} />
          <RoundColumn title="⚽ Final" matches={[final]} winners={winners} onPick={pickWinner} spacing={300} />
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: 24,
        background: `linear-gradient(to top, ${C.bg} 60%, transparent)`,
        display: 'flex', justifyContent: 'center',
      }}>
        <button
          disabled={!champion}
          onClick={() => champion && onComplete(champion)}
          style={{
            padding: '14px 48px',
            borderRadius: 8, border: 'none',
            fontSize: 14, fontWeight: 900,
            letterSpacing: '0.1em',
            cursor: champion ? 'pointer' : 'not-allowed',
            background: champion
              ? `linear-gradient(135deg, ${C.red} 0%, ${C.purple} 100%)`
              : 'rgba(255,255,255,0.07)',
            color: champion ? '#fff' : 'rgba(255,255,255,0.2)',
            boxShadow: champion ? '0 4px 24px rgba(200,16,46,0.35)' : 'none',
          }}
        >
          {champion ? 'VIEW MY FULL PREDICTIONS →' : 'Pick a Champion to Continue'}
        </button>
      </div>
    </div>
  )
}
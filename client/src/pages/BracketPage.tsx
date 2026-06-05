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
  border: 'rgba(107,33,168,0.35)',
  borderWinner: 'rgba(200,240,0,0.4)',
  lime: '#c8f000',
  red: '#c8102e',
  purple: '#6b21a8',
  white88: 'rgba(255,255,255,0.88)',
  white20: 'rgba(255,255,255,0.20)',
  white7: 'rgba(255,255,255,0.07)',
}

// Get team by group position
function getTeam(rankings: Rankings, groupId: string, position: number): Team | null {
  const group = GROUPS.find(g => g.id === groupId)
  if (!group) return null
  const ranked = rankings[groupId] || []
  const name = ranked[position]
  if (!name) return null
  const team = group.teams.find(t => t.name === name)
  return team ? { name: team.name, flag: team.flag } : null
}

// Get best third place team from a set of groups
function getBestThird(thirdPlaceTeams: ThirdPlaceTeam[], fromGroups: string[]): Team | null {
  const match = thirdPlaceTeams.find(t => fromGroups.includes(t.groupId))
  return match ? { name: match.name, flag: match.flag } : null
}

function MatchSlot({
  team1, team2, winner, onPick, label
}: {
  team1: Team | null
  team2: Team | null
  winner: Team | null
  onPick: (team: Team) => void
  label?: string
}) {
  const TeamRow = ({ team }: { team: Team | null }) => {
    if (!team) return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 10px',
        borderBottom: `1px solid ${C.border}`,
        opacity: 0.25, minHeight: 32,
      }}>
        <span style={{ fontSize: 10, color: C.white20 }}>TBD</span>
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
          cursor: 'pointer',
          transition: 'all 0.15s',
          minHeight: 32,
        }}
      >
        <span style={{ fontSize: 13 }}>{team.flag}</span>
        <span style={{
          fontSize: 11, fontWeight: 500, flex: 1,
          color: isWinner ? C.lime : C.white88,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          maxWidth: 90,
        }}>{team.name}</span>
        {isWinner && <span style={{ fontSize: 9, color: C.lime, fontWeight: 800 }}>✓</span>}
      </div>
    )
  }

  return (
    <div>
      {label && (
        <div style={{
          fontSize: 9, fontWeight: 700, color: C.white20,
          letterSpacing: '0.08em', marginBottom: 3, paddingLeft: 4,
        }}>{label}</div>
      )}
      <div style={{
        background: C.card,
        border: `1px solid ${winner ? C.borderWinner : C.border}`,
        borderRadius: 8, overflow: 'hidden', minWidth: 140,
      }}>
        <TeamRow team={team1} />
        <TeamRow team={team2} />
      </div>
    </div>
  )
}

function RoundColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 155 }}>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: C.lime,
        textAlign: 'center', padding: '8px 0 12px',
        borderBottom: `1px solid ${C.border}`,
        marginBottom: 12, whiteSpace: 'nowrap',
      }}>{title}</div>
      {children}
    </div>
  )
}

export default function BracketPage({ rankings, thirdPlaceTeams, onComplete }: Props) {
  const [winners, setWinners] = useState<Record<string, Team>>({})

  const pick = (matchId: string, team: Team) => {
    setWinners(prev => ({ ...prev, [matchId]: team }))
  }

  // ── ROUND OF 32 — Official FIFA matchups ──────────────────────────────────
  const r32: { id: string; label: string; team1: Team | null; team2: Team | null }[] = [
    { id: 'r32-1',  label: '1E vs 3ABCDF', team1: getTeam(rankings, 'E', 0), team2: getBestThird(thirdPlaceTeams, ['A','B','C','D','F']) },
    { id: 'r32-2',  label: '1I vs 3CDFGH', team1: getTeam(rankings, 'I', 0), team2: getBestThird(thirdPlaceTeams, ['C','D','F','G','H']) },
    { id: 'r32-3',  label: '2A vs 2B',     team1: getTeam(rankings, 'A', 1), team2: getTeam(rankings, 'B', 1) },
    { id: 'r32-4',  label: '1F vs 2C',     team1: getTeam(rankings, 'F', 0), team2: getTeam(rankings, 'C', 1) },
    { id: 'r32-5',  label: '2K vs 2L',     team1: getTeam(rankings, 'K', 1), team2: getTeam(rankings, 'L', 1) },
    { id: 'r32-6',  label: '1H vs 2J',     team1: getTeam(rankings, 'H', 0), team2: getTeam(rankings, 'J', 1) },
    { id: 'r32-7',  label: '1D vs 3BEFIJ', team1: getTeam(rankings, 'D', 0), team2: getBestThird(thirdPlaceTeams, ['B','E','F','I','J']) },
    { id: 'r32-8',  label: '1G vs 3AEHIJ', team1: getTeam(rankings, 'G', 0), team2: getBestThird(thirdPlaceTeams, ['A','E','H','I','J']) },
    { id: 'r32-9',  label: '1C vs 2F',     team1: getTeam(rankings, 'C', 0), team2: getTeam(rankings, 'F', 1) },
    { id: 'r32-10', label: '2E vs 2I',     team1: getTeam(rankings, 'E', 1), team2: getTeam(rankings, 'I', 1) },
    { id: 'r32-11', label: '1A vs 3CEFHI', team1: getTeam(rankings, 'A', 0), team2: getBestThird(thirdPlaceTeams, ['C','E','F','H','I']) },
    { id: 'r32-12', label: '1J vs 2H',     team1: getTeam(rankings, 'J', 0), team2: getTeam(rankings, 'H', 1) },
    { id: 'r32-13', label: '2D vs 2G',     team1: getTeam(rankings, 'D', 1), team2: getTeam(rankings, 'G', 1) },
    { id: 'r32-14', label: '1K vs 3DEIJL', team1: getTeam(rankings, 'K', 0), team2: getBestThird(thirdPlaceTeams, ['D','E','I','J','L']) },
    { id: 'r32-15', label: '1B vs 3CDFGH', team1: getTeam(rankings, 'B', 0), team2: getBestThird(thirdPlaceTeams, ['C','D','F','G','H']) },
    { id: 'r32-16', label: '1L vs 3AEHIJ', team1: getTeam(rankings, 'L', 0), team2: getBestThird(thirdPlaceTeams, ['A','E','H','I','J']) },
  ]

  // ── ROUND OF 16 ───────────────────────────────────────────────────────────
  const r16 = Array.from({ length: 8 }, (_, i) => ({
    id: `r16-${i}`,
    team1: winners[r32[i * 2].id] || null,
    team2: winners[r32[i * 2 + 1].id] || null,
  }))

  // ── QUARTER FINALS ────────────────────────────────────────────────────────
  const qf = Array.from({ length: 4 }, (_, i) => ({
    id: `qf-${i}`,
    team1: winners[r16[i * 2].id] || null,
    team2: winners[r16[i * 2 + 1].id] || null,
  }))

  // ── SEMI FINALS ───────────────────────────────────────────────────────────
  const sf = Array.from({ length: 2 }, (_, i) => ({
    id: `sf-${i}`,
    team1: winners[qf[i * 2].id] || null,
    team2: winners[qf[i * 2 + 1].id] || null,
  }))

  // ── FINAL ─────────────────────────────────────────────────────────────────
  const final = {
    id: 'final',
    team1: winners['sf-0'] || null,
    team2: winners['sf-1'] || null,
  }

  const champion = winners['final'] || null

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 112px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
        KNOCKOUT <span style={{ color: C.lime }}>BRACKET</span>
      </h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>
        Official FIFA WC26 matchups · Click the team you think will win each match
      </p>

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

      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 1000 }}>

          {/* R32 */}
          <RoundColumn title="Round of 32">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {r32.map(m => (
                <MatchSlot key={m.id} label={m.label} team1={m.team1} team2={m.team2}
                  winner={winners[m.id] || null} onPick={t => pick(m.id, t)} />
              ))}
            </div>
          </RoundColumn>

          {/* R16 */}
          <RoundColumn title="Round of 16">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 20 }}>
              {r16.map(m => (
                <div key={m.id} style={{ marginBottom: 16 }}>
                  <MatchSlot team1={m.team1} team2={m.team2}
                    winner={winners[m.id] || null} onPick={t => pick(m.id, t)} />
                </div>
              ))}
            </div>
          </RoundColumn>

          {/* QF */}
          <RoundColumn title="Quarter Finals">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 60 }}>
              {qf.map(m => (
                <div key={m.id} style={{ marginBottom: 60 }}>
                  <MatchSlot team1={m.team1} team2={m.team2}
                    winner={winners[m.id] || null} onPick={t => pick(m.id, t)} />
                </div>
              ))}
            </div>
          </RoundColumn>

          {/* SF */}
          <RoundColumn title="Semi Finals">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 140 }}>
              {sf.map(m => (
                <div key={m.id} style={{ marginBottom: 180 }}>
                  <MatchSlot team1={m.team1} team2={m.team2}
                    winner={winners[m.id] || null} onPick={t => pick(m.id, t)} />
                </div>
              ))}
            </div>
          </RoundColumn>

          {/* Final */}
          <RoundColumn title="⚽ Final">
            <div style={{ paddingTop: 300 }}>
              <MatchSlot team1={final.team1} team2={final.team2}
                winner={winners['final'] || null} onPick={t => pick('final', t)} />
            </div>
          </RoundColumn>

        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, padding: 24,
        background: `linear-gradient(to top, ${C.bg} 60%, transparent)`,
        display: 'flex', justifyContent: 'center',
      }}>
        <button
          disabled={!champion}
          onClick={() => champion && onComplete(champion)}
          style={{
            padding: '14px 48px', borderRadius: 8, border: 'none',
            fontSize: 14, fontWeight: 900, letterSpacing: '0.1em',
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
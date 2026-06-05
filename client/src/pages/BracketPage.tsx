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

function getTeam(rankings: Rankings, groupId: string, position: number): Team | null {
  const group = GROUPS.find(g => g.id === groupId)
  if (!group) return null
  const name = (rankings[groupId] || [])[position]
  if (!name) return null
  const team = group.teams.find(t => t.name === name)
  return team ? { name: team.name, flag: team.flag } : null
}

function assignThirdPlaceTeams(
  thirdPlaceTeams: ThirdPlaceTeam[],
  slots: { id: string; fromGroups: string[] }[]
): Record<string, Team | null> {
  const result: Record<string, Team | null> = {}
  const used = new Set<string>()
  for (const slot of slots) {
    const match = thirdPlaceTeams.find(
      t => slot.fromGroups.includes(t.groupId) && !used.has(t.name)
    )
    if (match) {
      result[slot.id] = { name: match.name, flag: match.flag }
      used.add(match.name)
    } else {
      result[slot.id] = null
    }
  }
  return result
}

function TeamRow({ team, isWinner, hasWinner, onPick }: {
  team: Team | null
  isWinner: boolean
  hasWinner: boolean
  onPick: () => void
}) {
  if (!team) return (
    <div style={{
      padding: '6px 8px', borderBottom: `1px solid ${C.border}`,
      fontSize: 10, color: C.white20, minHeight: 28,
    }}>TBD</div>
  )
  return (
    <div
      onClick={onPick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 8px', borderBottom: `1px solid ${C.border}`,
        background: isWinner ? 'rgba(200,240,0,0.08)' : 'transparent',
        opacity: hasWinner && !isWinner ? 0.3 : 1,
        cursor: 'pointer', transition: 'all 0.15s',
        minHeight: 28,
      }}
    >
      <span style={{ fontSize: 12 }}>{team.flag}</span>
      <span style={{
        fontSize: 10, fontWeight: 500, flex: 1,
        color: isWinner ? C.lime : C.white88,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        maxWidth: 80,
      }}>{team.name}</span>
      {isWinner && <span style={{ fontSize: 9, color: C.lime }}>✓</span>}
    </div>
  )
}

function MatchCard({ matchId, team1, team2, winner, label, onPick }: {
  matchId: string
  team1: Team | null
  team2: Team | null
  winner: Team | null
  label: string
  onPick: (matchId: string, team: Team) => void
}) {
  return (
    <div>
      <div style={{ fontSize: 8, color: 'rgba(200,240,0,0.5)', fontWeight: 700, marginBottom: 2, letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{
        background: C.card,
        border: `1px solid ${winner ? C.borderWinner : C.border}`,
        borderRadius: 7, overflow: 'hidden', minWidth: 120,
      }}>
        <TeamRow team={team1} isWinner={winner?.name === team1?.name} hasWinner={!!winner} onPick={() => team1 && onPick(matchId, team1)} />
        <div style={{ borderBottom: 'none' }}>
          <TeamRow team={team2} isWinner={winner?.name === team2?.name} hasWinner={!!winner} onPick={() => team2 && onPick(matchId, team2)} />
        </div>
      </div>
    </div>
  )
}

function ColHeader({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: C.lime,
      textAlign: 'center', padding: '6px 0 10px',
      borderBottom: `1px solid ${C.border}`,
      marginBottom: 10, whiteSpace: 'nowrap',
    }}>{title}</div>
  )
}

export default function BracketPage({ rankings, thirdPlaceTeams, onComplete }: Props) {
  const [winners, setWinners] = useState<Record<string, Team>>({})

  const pick = (matchId: string, team: Team) => {
    setWinners(prev => ({ ...prev, [matchId]: team }))
  }

  // Assign third place teams once — no duplicates
  const thirdSlots = [
    { id: 'l32-1', fromGroups: ['A','B','C','D','F'] },
    { id: 'l32-2', fromGroups: ['C','D','F','G','H'] },
    { id: 'l32-7', fromGroups: ['B','E','F','I','J'] },
    { id: 'l32-8', fromGroups: ['A','E','H','I','J'] },
    { id: 'r32-3', fromGroups: ['C','E','F','H','I'] },
    { id: 'r32-4', fromGroups: ['E','H','I','J','K'] },
    { id: 'r32-7', fromGroups: ['E','F','G','I','J'] },
    { id: 'r32-8', fromGroups: ['D','E','I','J','L'] },
  ]
  const thirdAssigned = assignThirdPlaceTeams(thirdPlaceTeams, thirdSlots)

  // ── LEFT SIDE R32 ─────────────────────────────────────────────────────────
  const leftR32 = [
    { id: 'l32-1', label: '1E vs 3ABCDF', team1: getTeam(rankings,'E',0), team2: thirdAssigned['l32-1'] },
    { id: 'l32-2', label: '1I vs 3CDFGH', team1: getTeam(rankings,'I',0), team2: thirdAssigned['l32-2'] },
    { id: 'l32-3', label: '2A vs 2B',     team1: getTeam(rankings,'A',1), team2: getTeam(rankings,'B',1) },
    { id: 'l32-4', label: '1F vs 2C',     team1: getTeam(rankings,'F',0), team2: getTeam(rankings,'C',1) },
    { id: 'l32-5', label: '2K vs 2L',     team1: getTeam(rankings,'K',1), team2: getTeam(rankings,'L',1) },
    { id: 'l32-6', label: '1H vs 2J',     team1: getTeam(rankings,'H',0), team2: getTeam(rankings,'J',1) },
    { id: 'l32-7', label: '1D vs 3BEFIJ', team1: getTeam(rankings,'D',0), team2: thirdAssigned['l32-7'] },
    { id: 'l32-8', label: '1G vs 3AEHIJ', team1: getTeam(rankings,'G',0), team2: thirdAssigned['l32-8'] },
  ]

  // ── RIGHT SIDE R32 ────────────────────────────────────────────────────────
  const rightR32 = [
    { id: 'r32-1', label: '1C vs 2F',     team1: getTeam(rankings,'C',0), team2: getTeam(rankings,'F',1) },
    { id: 'r32-2', label: '2E vs 2I',     team1: getTeam(rankings,'E',1), team2: getTeam(rankings,'I',1) },
    { id: 'r32-3', label: '1A vs 3CEFHI', team1: getTeam(rankings,'A',0), team2: thirdAssigned['r32-3'] },
    { id: 'r32-4', label: '1L vs 3EHIJK', team1: getTeam(rankings,'L',0), team2: thirdAssigned['r32-4'] },
    { id: 'r32-5', label: '1J vs 2H',     team1: getTeam(rankings,'J',0), team2: getTeam(rankings,'H',1) },
    { id: 'r32-6', label: '2D vs 2G',     team1: getTeam(rankings,'D',1), team2: getTeam(rankings,'G',1) },
    { id: 'r32-7', label: '1B vs 3EFGIJ', team1: getTeam(rankings,'B',0), team2: thirdAssigned['r32-7'] },
    { id: 'r32-8', label: '1K vs 3DEIJL', team1: getTeam(rankings,'K',0), team2: thirdAssigned['r32-8'] },
  ]

  // ── LEFT R16 ──────────────────────────────────────────────────────────────
  const leftR16 = Array.from({ length: 4 }, (_, i) => ({
    id: `lr16-${i}`,
    team1: winners[leftR32[i * 2].id] || null,
    team2: winners[leftR32[i * 2 + 1].id] || null,
  }))

  // ── RIGHT R16 ─────────────────────────────────────────────────────────────
  const rightR16 = Array.from({ length: 4 }, (_, i) => ({
    id: `rr16-${i}`,
    team1: winners[rightR32[i * 2].id] || null,
    team2: winners[rightR32[i * 2 + 1].id] || null,
  }))

  // ── LEFT QF ───────────────────────────────────────────────────────────────
  const leftQF = Array.from({ length: 2 }, (_, i) => ({
    id: `lqf-${i}`,
    team1: winners[leftR16[i * 2].id] || null,
    team2: winners[leftR16[i * 2 + 1].id] || null,
  }))

  // ── RIGHT QF ──────────────────────────────────────────────────────────────
  const rightQF = Array.from({ length: 2 }, (_, i) => ({
    id: `rqf-${i}`,
    team1: winners[rightR16[i * 2].id] || null,
    team2: winners[rightR16[i * 2 + 1].id] || null,
  }))

  // ── SEMI FINALS ───────────────────────────────────────────────────────────
  const leftSF = {
    id: 'lsf',
    team1: winners['lqf-0'] || null,
    team2: winners['lqf-1'] || null,
  }
  const rightSF = {
    id: 'rsf',
    team1: winners['rqf-0'] || null,
    team2: winners['rqf-1'] || null,
  }

  // ── FINAL ─────────────────────────────────────────────────────────────────
  const final = {
    id: 'final',
    team1: winners['lsf'] || null,
    team2: winners['rsf'] || null,
  }

  const champion = winners['final'] || null

  const spacer = (h: number) => <div style={{ height: h }} />

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 112px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
        KNOCKOUT <span style={{ color: C.lime }}>BRACKET</span>
      </h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>
        Official FIFA WC26 two-sided bracket · Click a team to pick them as winner
      </p>

      {/* Champion banner */}
      {champion && (
        <div style={{
          background: 'rgba(200,240,0,0.06)', border: `2px solid rgba(200,240,0,0.4)`,
          borderRadius: 14, padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
          boxShadow: '0 0 40px rgba(200,240,0,0.08)',
        }}>
          <span style={{ fontSize: 40 }}>🏆</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: C.lime, marginBottom: 4 }}>
              YOUR WORLD CUP 2026 CHAMPION
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              {champion.flag} {champion.name}
            </div>
          </div>
        </div>
      )}

      {/* Bracket */}
      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6, minWidth: 1100, alignItems: 'flex-start' }}>

          {/* LEFT R32 */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 135 }}>
            <ColHeader title="Round of 32" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {leftR32.map(m => (
                <MatchCard key={m.id} matchId={m.id} label={m.label}
                  team1={m.team1} team2={m.team2}
                  winner={winners[m.id] || null} onPick={pick} />
              ))}
            </div>
          </div>

          {/* LEFT R16 */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
            <ColHeader title="Round of 16" />
            {spacer(18)}
            {leftR16.map((m, i) => (
              <div key={m.id}>
                {i > 0 && spacer(28)}
                <MatchCard matchId={m.id} label={`R16-L${i+1}`}
                  team1={m.team1} team2={m.team2}
                  winner={winners[m.id] || null} onPick={pick} />
              </div>
            ))}
          </div>

          {/* LEFT QF */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
            <ColHeader title="Quarter Finals" />
            {spacer(54)}
            {leftQF.map((m, i) => (
              <div key={m.id}>
                {i > 0 && spacer(88)}
                <MatchCard matchId={m.id} label={`QF-L${i+1}`}
                  team1={m.team1} team2={m.team2}
                  winner={winners[m.id] || null} onPick={pick} />
              </div>
            ))}
          </div>

          {/* LEFT SF */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
            <ColHeader title="Semi Final" />
            {spacer(140)}
            <MatchCard matchId={leftSF.id} label="SF Left"
              team1={leftSF.team1} team2={leftSF.team2}
              winner={winners[leftSF.id] || null} onPick={pick} />
          </div>

          {/* CENTER FINAL */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 140 }}>
            <ColHeader title="⚽ Final" />
            {spacer(260)}
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 6 }}>🏆</div>
            <div style={{
              background: C.card,
              border: `2px solid ${champion ? 'rgba(200,240,0,0.5)' : C.border}`,
              borderRadius: 8, overflow: 'hidden', width: '100%',
              boxShadow: champion ? '0 0 24px rgba(200,240,0,0.15)' : 'none',
            }}>
              <div style={{
                textAlign: 'center', padding: '5px',
                fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                color: C.lime, borderBottom: `1px solid ${C.border}`,
              }}>FINAL</div>
              <TeamRow team={final.team1} isWinner={champion?.name === final.team1?.name}
                hasWinner={!!champion} onPick={() => final.team1 && pick('final', final.team1)} />
              <TeamRow team={final.team2} isWinner={champion?.name === final.team2?.name}
                hasWinner={!!champion} onPick={() => final.team2 && pick('final', final.team2)} />
            </div>
          </div>

          {/* RIGHT SF */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
            <ColHeader title="Semi Final" />
            {spacer(140)}
            <MatchCard matchId={rightSF.id} label="SF Right"
              team1={rightSF.team1} team2={rightSF.team2}
              winner={winners[rightSF.id] || null} onPick={pick} />
          </div>

          {/* RIGHT QF */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
            <ColHeader title="Quarter Finals" />
            {spacer(54)}
            {rightQF.map((m, i) => (
              <div key={m.id}>
                {i > 0 && spacer(88)}
                <MatchCard matchId={m.id} label={`QF-R${i+1}`}
                  team1={m.team1} team2={m.team2}
                  winner={winners[m.id] || null} onPick={pick} />
              </div>
            ))}
          </div>

          {/* RIGHT R16 */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
            <ColHeader title="Round of 16" />
            {spacer(18)}
            {rightR16.map((m, i) => (
              <div key={m.id}>
                {i > 0 && spacer(28)}
                <MatchCard matchId={m.id} label={`R16-R${i+1}`}
                  team1={m.team1} team2={m.team2}
                  winner={winners[m.id] || null} onPick={pick} />
              </div>
            ))}
          </div>

          {/* RIGHT R32 */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 135 }}>
            <ColHeader title="Round of 32" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {rightR32.map(m => (
                <MatchCard key={m.id} matchId={m.id} label={m.label}
                  team1={m.team1} team2={m.team2}
                  winner={winners[m.id] || null} onPick={pick} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CTA */}
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
import { Group } from '../data/groups'

type Props = {
  group: Group
  rankings: Record<string, string[]>
  onToggle: (groupId: string, teamName: string) => void
}

const C = {
  bg: '#0e0416',
  card: '#1a0820',
  cardHeader: '#130320',
  border: 'rgba(107,33,168,0.35)',
  borderDone: 'rgba(200,240,0,0.4)',
  rowBorder: 'rgba(107,33,168,0.1)',
  lime: '#c8f000',
  red: '#c8102e',
  purple: '#a855f7',
  white88: 'rgba(255,255,255,0.88)',
  white20: 'rgba(255,255,255,0.20)',
  white7: 'rgba(255,255,255,0.07)',
}

export default function GroupCard({ group, rankings, onToggle }: Props) {
  const current = rankings[group.id] || []
  const complete = current.length === 4

  const sorted = [...group.teams].sort((a, b) => {
    const ai = current.indexOf(a.name)
    const bi = current.indexOf(b.name)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  const rowBg = (rank: number) => {
    if (rank === 0) return 'rgba(200,240,0,0.07)'
    if (rank === 1) return 'rgba(200,240,0,0.03)'
    if (rank === 2) return 'rgba(255, 255, 255, 0.28)'
    if (rank === 3) return 'rgba(200,16,46,0.05)'
    return 'transparent'
  }

  const badgeStyle = (rank: number) => {
    if (rank === 0) return { background: C.lime, color: C.bg }
    if (rank === 1) return { background: 'rgba(200,240,0,0.2)', color: C.lime }
    if (rank === 2) return { background: 'rgba(255, 255, 255, 0.28)', color: 'rgba(255,255,255,0.7)' }
    if (rank === 3) return { background: 'rgba(200,16,46,0.2)', color: C.red }
    return { background: C.white7, color: C.white20 }
  }

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${complete ? C.borderDone : C.border}`,
      borderLeft: complete ? `3px solid ${C.lime}` : `1px solid ${C.border}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        background: C.cardHeader,
        borderBottom: '1px solid rgba(107,33,168,0.25)',
        padding: '9px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: complete ? C.lime : C.red }}>
          GROUP {group.id}
        </span>
        {complete
          ? <span style={{ fontSize: 10, fontWeight: 700, color: C.lime }}>✓ DONE</span>
          : <span style={{ fontSize: 10, color: C.white20 }}>Click to rank</span>
        }
      </div>

      {sorted.map((team) => {
        const rank = current.indexOf(team.name)
        return (
          <div
            key={team.name}
            onClick={() => onToggle(group.id, team.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderBottom: `1px solid ${C.rowBorder}`,
              background: rowBg(rank),
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 20, height: 20,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800,
              flexShrink: 0,
              ...badgeStyle(rank),
            }}>
              {rank >= 0 ? rank + 1 : '·'}
            </div>

            <span style={{ fontSize: 17 }}>{team.flag}</span>
            <span style={{ fontSize: 12, fontWeight: 500, flex: 1, color: C.white88 }}>
              {team.name}
            </span>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {team.host && (
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  background: 'rgba(200,16,46,0.15)', color: C.red,
                  border: '1px solid rgba(200,16,46,0.3)',
                  padding: '1px 5px', borderRadius: 3,
                }}>HOST</span>
              )}
              {team.debut && (
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  background: 'rgba(107,33,168,0.2)', color: C.purple,
                  border: '1px solid rgba(107,33,168,0.3)',
                  padding: '1px 5px', borderRadius: 3,
                }}>DEBUT</span>
              )}
              {rank === 0 && <span style={{ fontSize: 9, fontWeight: 800, color: C.lime }}>ADV</span>}
              {rank === 1 && <span style={{ fontSize: 9, fontWeight: 800, color: C.lime }}>ADV</span>}
              {rank === 3 && <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(200,16,46,0.55)' }}>OUT</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
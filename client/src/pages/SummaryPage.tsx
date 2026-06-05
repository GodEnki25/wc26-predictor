import { GROUPS } from '../data/groups'

type Team = { name: string; flag: string }
type Rankings = Record<string, string[]>

interface Props {
  champion: Team
  rankings: Rankings
}

const C = {
  bg: '#0e0416',
  card: '#1a0820',
  cardHeader: '#130320',
  border: 'rgba(107,33,168,0.35)',
  lime: '#c8f000',
  red: '#c8102e',
  purple: '#6b21a8',
  purple2: '#a855f7',
  white88: 'rgba(255,255,255,0.88)',
  white50: 'rgba(255,255,255,0.50)',
  white20: 'rgba(255,255,255,0.20)',
  white7: 'rgba(255,255,255,0.07)',
}

export default function SummaryPage({ champion, rankings }: Props) {

  const handleShare = () => {
    const text = `🏆 My FIFA World Cup 2026 prediction: ${champion.flag} ${champion.name} wins it all! #WC26 #WorldCup2026`
    if (navigator.share) {
      navigator.share({ title: 'My WC26 Prediction', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* Champion Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200,240,0,0.1), rgba(200,240,0,0.03))',
        border: `2px solid rgba(200,240,0,0.45)`,
        borderRadius: 16, padding: '28px 32px',
        display: 'flex', alignItems: 'center', gap: 24,
        marginBottom: 24,
        boxShadow: '0 0 60px rgba(200,240,0,0.08)',
      }}>
        <span style={{ fontSize: 56 }}>🏆</span>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.lime, marginBottom: 6,
          }}>
            Your World Cup 2026 Champion
          </div>
          <div style={{
            fontSize: 40, fontWeight: 900, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 12,
            lineHeight: 1,
          }}>
            <span>{champion.flag}</span>
            <span>{champion.name}</span>
          </div>
        </div>
      </div>

      {/* Group Results */}
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14, overflow: 'hidden',
        marginBottom: 24,
      }}>
        <div style={{
          background: C.cardHeader,
          borderBottom: `1px solid ${C.border}`,
          padding: '12px 20px',
          fontSize: 11, fontWeight: 800,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: C.lime,
        }}>
          📋 Group Stage Results
        </div>

        {GROUPS.map((g, gi) => {
          const ranked = rankings[g.id] || []
          return (
            <div
              key={g.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 20px',
                borderBottom: gi < GROUPS.length - 1 ? `1px solid rgba(107,33,168,0.1)` : 'none',
                flexWrap: 'wrap',
              }}
            >
              <span style={{
                fontSize: 11, fontWeight: 800,
                letterSpacing: '0.1em', color: C.red,
                width: 28, flexShrink: 0,
              }}>G{g.id}</span>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                {ranked.map((name, i) => {
                  const team = g.teams.find(t => t.name === name)
                  if (!team) return null
                  return (
                    <div key={name} style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '3px 8px', borderRadius: 6,
                      background: i < 2 ? 'rgba(200,240,0,0.08)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${i < 2 ? 'rgba(200,240,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      <span style={{ fontSize: 14 }}>{team.flag}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: i < 2 ? C.white88 : C.white50,
                      }}>{team.name}</span>
                      {i < 2 && (
                        <span style={{ fontSize: 9, fontWeight: 800, color: C.lime }}>ADV</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Share Button */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={handleShare}
          style={{
            padding: '14px 48px',
            borderRadius: 8, border: 'none',
            fontSize: 14, fontWeight: 900,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            background: `linear-gradient(135deg, ${C.red} 0%, ${C.purple} 100%)`,
            color: '#fff',
            boxShadow: '0 4px 24px rgba(200,16,46,0.35)',
          }}
        >
          🔗 SHARE MY PREDICTIONS
        </button>
      </div>

    </div>
  )
}
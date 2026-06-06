import { GROUPS } from '../data/groups'

type Team = { name: string; flag: string }
type Rankings = Record<string, string[]>
type ThirdPlaceTeam = { name: string; flag: string; groupId: string }
type User = { id: string; email: string; name: string } | null

interface Props {
  champion: Team
  rankings: Rankings
  thirdPlaceTeams: ThirdPlaceTeam[]
  onSave: () => void
  saving: boolean
  saved: boolean
  user: User
  onGoToAI: () => void
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

export default function SummaryPage({
  champion,
  rankings,
  thirdPlaceTeams,
  onSave,
  saving,
  saved,
  user,
  onGoToAI,
}: Props) {

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

      {/* Third Place Teams */}
      {thirdPlaceTeams.length > 0 && (
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
            🥉 Your 8 Third-Place Teams
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, padding: '14px 20px',
          }}>
            {thirdPlaceTeams.map((team, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(200,240,0,0.06)',
                border: '1px solid rgba(200,240,0,0.2)',
                borderRadius: 8, padding: '6px 12px',
              }}>
                <span style={{ fontSize: 16 }}>{team.flag}</span>
                <span style={{ fontSize: 12, color: C.white88 }}>{team.name}</span>
                <span style={{ fontSize: 9, color: C.lime, fontWeight: 700 }}>
                  G{team.groupId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <div key={g.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 20px',
              borderBottom: gi < GROUPS.length - 1
                ? `1px solid rgba(107,33,168,0.1)` : 'none',
              flexWrap: 'wrap',
            }}>
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
                      background: i < 2
                        ? 'rgba(200,240,0,0.08)'
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${i < 2
                        ? 'rgba(200,240,0,0.2)'
                        : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      <span style={{ fontSize: 14 }}>{team.flag}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: i < 2 ? C.white88 : C.white50,
                      }}>{team.name}</span>
                      {i < 2 && (
                        <span style={{
                          fontSize: 9, fontWeight: 800, color: C.lime,
                        }}>ADV</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 12,
      }}>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            width: '100%', maxWidth: 400,
            padding: '14px 48px', borderRadius: 8,
            border: saved ? '1px solid rgba(61,220,132,0.3)' : 'none',
            fontSize: 14, fontWeight: 900, letterSpacing: '0.1em',
            cursor: saving ? 'not-allowed' : 'pointer',
            background: saved
              ? 'rgba(61,220,132,0.2)'
              : saving
              ? 'rgba(255,255,255,0.07)'
              : `linear-gradient(135deg, ${C.red} 0%, ${C.purple} 100%)`,
            color: saved ? '#3ddc84' : saving ? C.white20 : '#fff',
            boxShadow: saved || saving ? 'none' : '0 4px 24px rgba(200,16,46,0.35)',
            transition: 'all 0.2s',
          }}
        >
          {saved
            ? '✅ PREDICTIONS SAVED!'
            : saving
            ? 'SAVING...'
            : user
            ? '💾 SAVE MY PREDICTIONS'
            : '🔐 LOGIN TO SAVE'}
        </button>

        {/* AI Analysis */}
        <button
          onClick={onGoToAI}
          style={{
            width: '100%', maxWidth: 400,
            padding: '14px 48px', borderRadius: 8,
            border: `1px solid rgba(200,240,0,0.3)`,
            fontSize: 14, fontWeight: 900, letterSpacing: '0.1em',
            cursor: 'pointer',
            background: 'rgba(200,240,0,0.06)',
            color: C.lime,
            transition: 'all 0.2s',
          }}
        >
          🤖 GET AI ANALYSIS OF MY PICKS
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          style={{
            width: '100%', maxWidth: 400,
            padding: '14px 32px', borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 14, fontWeight: 900, letterSpacing: '0.1em',
            cursor: 'pointer',
            background: 'transparent',
            color: C.white88,
          }}
        >
          🔗 SHARE MY PREDICTIONS
        </button>

      </div>
    </div>
  )
}
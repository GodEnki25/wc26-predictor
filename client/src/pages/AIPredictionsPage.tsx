import { useEffect, useState } from 'react'
import { analyzeUserPredictions, getAIPredictions } from '../services/gemini'

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
}

export default function AIPredictionsPage({ champion, rankings }: Props) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'ai-bracket'>('analysis')
  const [analysis, setAnalysis] = useState<string>('')
  const [aiPicks, setAiPicks] = useState<any>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingAI, setLoadingAI] = useState(false)
  const [error, setError] = useState<string>('')

  const fetchAnalysis = async (retries = 2) => {
    setLoadingAnalysis(true)
    setError('')
    try {
      const result = await analyzeUserPredictions(champion, rankings)
      setAnalysis(result)
    } catch (e) {
      if (retries > 0 && e?.message?.includes('429')) {
        setTimeout(() => fetchAnalysis(retries - 1), 5000)
      } else {
        setError('Aliens are Watching You. Just kidding, Just chill, and try again.')
      }
    }
    setLoadingAnalysis(false)
  }

  const fetchAIPicks = async () => {
    setLoadingAI(true)
    setError('')
    try {
      const result = await getAIPredictions()
      setAiPicks(result)
    } catch (e) {
      setError('Failed to get AI predictions. Please try again.')
    }
    setLoadingAI(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchAnalysis()
    }, 1000) // slight delay to ensure champion and rankings are loaded
    return () => clearTimeout(timer)

  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
          🤖 <span style={{ color: C.lime }}>AI ANALYSIS</span>
        </h1>
        <p style={{ fontSize: 12, color: C.white20 }}>
          Powered by Google Gemini 1.5 Flash
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'analysis', label: '📊 Analyze My Picks' },
          { id: 'ai-bracket', label: '🤖 AI\'s Own Picks' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id as any)
              if (id === 'ai-bracket' && !aiPicks) fetchAIPicks()
            }}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: activeTab === id
                ? `linear-gradient(135deg, ${C.red}, ${C.purple})`
                : C.card,
              color: activeTab === id ? '#fff' : C.white50,
              border: `1px solid ${activeTab === id ? 'transparent' : C.border}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)',
          borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          fontSize: 13, color: '#fc8181',
        }}>{error}</div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '24px', marginBottom: 16,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: C.lime, marginBottom: 16,
            }}>
              🏆 Your Champion: {champion.flag} {champion.name}
            </div>

            {loadingAnalysis ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${C.purple}`,
                  borderTopColor: C.lime,
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{ fontSize: 13, color: C.white50 }}>
                  Gemini is analyzing your picks...
                </span>
              </div>
            ) : analysis ? (
              <p style={{
                fontSize: 14, color: C.white88, lineHeight: 1.8,
                fontStyle: 'italic',
              }}>
                "{analysis}"
              </p>
            ) : null}
          </div>

          <button
            onClick={fetchAnalysis}
            disabled={loadingAnalysis}
            style={{
              padding: '12px 28px', borderRadius: 8, border: 'none',
              fontSize: 13, fontWeight: 700, cursor: loadingAnalysis ? 'not-allowed' : 'pointer',
              background: loadingAnalysis ? C.card : `linear-gradient(135deg, ${C.red}, ${C.purple})`,
              color: loadingAnalysis ? C.white20 : '#fff',
            }}
          >
            {loadingAnalysis ? 'Analyzing...' : '🔄 Regenerate Analysis'}
          </button>
        </div>
      )}

      {/* AI Bracket Tab */}
      {activeTab === 'ai-bracket' && (
        <div>
          {loadingAI ? (
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: '40px 24px', textAlign: 'center',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: `3px solid ${C.purple}`,
                borderTopColor: C.lime,
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 16px',
              }} />
              <p style={{ fontSize: 14, color: C.white50 }}>
                Gemini is building its bracket...
              </p>
            </div>
          ) : aiPicks ? (
            <div>
              {/* AI Champion */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(200,240,0,0.1), rgba(200,240,0,0.03))',
                border: `2px solid rgba(200,240,0,0.4)`,
                borderRadius: 14, padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: 20,
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 40 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: C.lime, marginBottom: 4 }}>
                    AI CHAMPION PICK
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>
                    {aiPicks.champion.flag} {aiPicks.champion.name}
                  </div>
                </div>
              </div>

              {/* Final Four */}
              <div style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, overflow: 'hidden', marginBottom: 16,
              }}>
                <div style={{
                  background: C.cardHeader, borderBottom: `1px solid ${C.border}`,
                  padding: '10px 18px', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.14em', textTransform: 'uppercase', color: C.lime,
                }}>
                  🏅 AI Final Four
                </div>
                {[
                  { pos: '🥇 Champion', team: aiPicks.champion },
                  { pos: '🥈 Runner-Up', team: aiPicks.runnerUp },
                  { pos: '🥉 3rd Place', team: aiPicks.thirdPlace },
                  { pos: '4️⃣ 4th Place', team: aiPicks.fourthPlace },
                ].map(({ pos, team }, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 18px',
                    borderBottom: i < 3 ? `1px solid rgba(107,33,168,0.1)` : 'none',
                  }}>
                    <span style={{ fontSize: 12, color: C.white50, width: 80 }}>{pos}</span>
                    <span style={{ fontSize: 18 }}>{team.flag}</span>
                    <span style={{ fontSize: 13, color: C.white88 }}>{team.name}</span>
                    {/* Compare with user */}
                    {team.name === champion.name && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                        color: C.lime, background: 'rgba(200,240,0,0.1)',
                        border: '1px solid rgba(200,240,0,0.2)',
                        padding: '2px 8px', borderRadius: 4,
                      }}>✓ YOU AGREE</span>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Analysis */}
              <div style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '20px 24px', marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: C.purple2, marginBottom: 12,
                }}>
                  🤖 AI Reasoning
                </div>
                <p style={{ fontSize: 13, color: C.white88, lineHeight: 1.8, fontStyle: 'italic' }}>
                  "{aiPicks.analysis}"
                </p>
              </div>

              {/* Head to Head */}
              <div style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{
                  background: C.cardHeader, borderBottom: `1px solid ${C.border}`,
                  padding: '10px 18px', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.14em', textTransform: 'uppercase', color: C.lime,
                }}>
                  ⚔️ You vs AI — Head to Head
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  borderBottom: `1px solid rgba(107,33,168,0.1)`,
                }}>
                  <div style={{ padding: '8px 18px', fontSize: 10, fontWeight: 800, color: C.white50, borderRight: `1px solid rgba(107,33,168,0.1)` }}>YOUR PICK</div>
                  <div style={{ padding: '8px 18px', fontSize: 10, fontWeight: 800, color: C.purple2 }}>AI PICK</div>
                </div>
                {[
                  { label: 'Champion', yours: champion, ai: aiPicks.champion },
                  { label: 'Runner-Up', yours: null, ai: aiPicks.runnerUp },
                  { label: '3rd Place', yours: null, ai: aiPicks.thirdPlace },
                ].map(({ label, yours, ai }, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    borderBottom: i < 2 ? `1px solid rgba(107,33,168,0.08)` : 'none',
                  }}>
                    <div style={{
                      padding: '10px 18px', fontSize: 12, color: C.white88,
                      borderRight: `1px solid rgba(107,33,168,0.1)`,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {yours ? <>{yours.flag} {yours.name}</> : <span style={{ color: C.white20 }}>—</span>}
                    </div>
                    <div style={{
                      padding: '10px 18px', fontSize: 12, color: C.white88,
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: yours?.name === ai.name ? 'rgba(200,240,0,0.04)' : 'transparent',
                    }}>
                      {ai.flag} {ai.name}
                      {yours?.name === ai.name && <span style={{ color: C.lime, fontSize: 10 }}>✓ Match!</span>}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={fetchAIPicks}
                style={{
                  marginTop: 16, padding: '12px 28px', borderRadius: 8, border: 'none',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  background: `linear-gradient(135deg, ${C.red}, ${C.purple})`,
                  color: '#fff',
                }}
              >
                🔄 Regenerate AI Picks
              </button>
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
import { useState } from 'react'
import { GROUPS } from '../data/groups'

type Team = { name: string; flag: string; groupId: string }
type Rankings = Record<string, string[]>

interface Props {
  rankings: Rankings
  onComplete: (thirdPlace: Team[]) => void
}

const C = {
  bg: '#0e0416',
  card: '#1a0820',
  cardHeader: '#130320',
  border: 'rgba(107,33,168,0.35)',
  borderSelected: 'rgba(200,240,0,0.4)',
  lime: '#c8f000',
  red: '#c8102e',
  purple: '#6b21a8',
  purple2: '#a855f7',
  white88: 'rgba(255,255,255,0.88)',
  white50: 'rgba(255,255,255,0.50)',
  white20: 'rgba(255,255,255,0.20)',
  white7: 'rgba(255,255,255,0.07)',
}

export default function ThirdPlacePage({ rankings, onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  // Get all 12 third place teams
  const thirdPlaceTeams: Team[] = GROUPS.map(g => {
    const ranked = rankings[g.id] || []
    const name = ranked[2]
    if (!name) return null
    const team = g.teams.find(t => t.name === name)
    return team ? { name: team.name, flag: team.flag, groupId: g.id } : null
  }).filter(Boolean) as Team[]

  const toggle = (name: string) => {
    setSelected(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name)
      if (prev.length >= 8) return prev
      return [...prev, name]
    })
  }

  const done = selected.length === 8

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 112px' }}>

      {/* Progress indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 28,
      }}>
        <div style={{
          height: 2, flex: 1,
          background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(selected.length / 8) * 100}%`,
            background: `linear-gradient(90deg, ${C.red}, ${C.lime})`,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ fontSize: 12, color: C.lime, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {selected.length}/8 selected
        </span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
        BEST <span style={{ color: C.lime }}>THIRD PLACE</span> TEAMS
      </h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
        Pick the 8 third-place teams you think will advance to the Round of 32.
      </p>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 28 }}>
        FIFA ranks them by: Points → Goal Difference → Goals Scored → Fair Play → FIFA Ranking
      </p>

      {/* Teams grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 10,
        marginBottom: 24,
      }}>
        {thirdPlaceTeams.map((team, i) => {
          const isSelected = selected.includes(team.name)
          const isFull = selected.length >= 8 && !isSelected

          return (
            <div
              key={team.name}
              onClick={() => !isFull && toggle(team.name)}
              style={{
                background: isSelected ? 'rgba(200,240,0,0.06)' : C.card,
                border: `1px solid ${isSelected ? C.borderSelected : C.border}`,
                borderLeft: isSelected ? `3px solid ${C.lime}` : `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: isFull ? 'not-allowed' : 'pointer',
                opacity: isFull ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              {/* Selection indicator */}
              <div style={{
                width: 22, height: 22,
                borderRadius: '50%',
                border: `2px solid ${isSelected ? C.lime : 'rgba(107,33,168,0.4)'}`,
                background: isSelected ? C.lime : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}>
                {isSelected && (
                  <span style={{ fontSize: 11, color: C.bg, fontWeight: 900 }}>✓</span>
                )}
              </div>

              <span style={{ fontSize: 22 }}>{team.flag}</span>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#fff' : C.white88 }}>
                  {team.name}
                </div>
                <div style={{ fontSize: 10, color: isSelected ? C.lime : C.white20, marginTop: 2 }}>
                  Group {team.groupId} · 3rd Place
                </div>
              </div>

              {isSelected && (
                <div style={{
                  fontSize: 10, fontWeight: 800,
                  color: C.lime,
                  background: 'rgba(200,240,0,0.1)',
                  border: `1px solid rgba(200,240,0,0.2)`,
                  padding: '2px 7px', borderRadius: 4,
                }}>ADV</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: '14px 18px',
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 800,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: C.lime, marginBottom: 10,
          }}>
            Your advancing third-place teams ({selected.length}/8)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selected.map(name => {
              const team = thirdPlaceTeams.find(t => t.name === name)
              return team ? (
                <div key={name} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(200,240,0,0.07)',
                  border: '1px solid rgba(200,240,0,0.2)',
                  borderRadius: 6, padding: '4px 10px',
                  cursor: 'pointer',
                }} onClick={() => toggle(name)}>
                  <span style={{ fontSize: 14 }}>{team.flag}</span>
                  <span style={{ fontSize: 11, color: C.white88 }}>{team.name}</span>
                  <span style={{ fontSize: 10, color: 'rgba(200,16,46,0.6)', marginLeft: 2 }}>✕</span>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: 24,
        background: `linear-gradient(to top, ${C.bg} 60%, transparent)`,
        display: 'flex', justifyContent: 'center',
      }}>
        <button
          disabled={!done}
          onClick={() => {
            const teams = selected.map(name => thirdPlaceTeams.find(t => t.name === name)!)
            onComplete(teams)
          }}
          style={{
            padding: '14px 48px',
            borderRadius: 8, border: 'none',
            fontSize: 14, fontWeight: 900,
            letterSpacing: '0.1em',
            cursor: done ? 'pointer' : 'not-allowed',
            background: done
              ? `linear-gradient(135deg, ${C.red} 0%, ${C.purple} 100%)`
              : 'rgba(255,255,255,0.07)',
            color: done ? '#fff' : 'rgba(255,255,255,0.2)',
            boxShadow: done ? '0 4px 24px rgba(200,16,46,0.35)' : 'none',
          }}
        >
          {done ? 'CONTINUE TO BRACKET →' : `SELECT ${8 - selected.length} MORE TEAMS`}
        </button>
      </div>
    </div>
  )
}
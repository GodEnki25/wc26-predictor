const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── AUTH ──────────────────────────────────────────────────────────────────
export async function signup(email: string, password: string, name: string) {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

// ── PREDICTIONS ───────────────────────────────────────────────────────────
export async function savePrediction(token: string, payload: {
  champion: string
  championFlag: string
  rankings: Record<string, string[]>
  thirdPlaceTeams: { name: string; flag: string; groupId: string }[]
  bracketWinners: Record<string, { name: string; flag: string }>
}) {
  const res = await fetch(`${BASE_URL}/api/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function getMyPrediction(token: string) {
  const res = await fetch(`${BASE_URL}/api/predictions/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

// ── AI ────────────────────────────────────────────────────────────────────
export async function getAIAnalysis(
  champion: { name: string; flag: string },
  rankings: Record<string, string[]>
) {
  const res = await fetch(`${BASE_URL}/api/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ champion, rankings }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.analysis
}

export async function getAIPredictions() {
  const res = await fetch(`${BASE_URL}/api/ai/predictions`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}
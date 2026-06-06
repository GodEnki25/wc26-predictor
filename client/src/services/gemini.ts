import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

export type Team = { name: string; flag: string }
export type Rankings = Record<string, string[]>

export async function analyzeUserPredictions(
  champion: Team,
  rankings: Rankings
): Promise<string> {
  const groupSummary = Object.entries(rankings)
    .map(([g, teams]) => `Group ${g}: ${teams.join(' > ')}`)
    .join('\n')

  const prompt = `
You are a FIFA World Cup 2026 expert analyst. A user has made these predictions:

CHAMPION PICK: ${champion.flag} ${champion.name}

GROUP STAGE PREDICTIONS:
${groupSummary}

Give a fun, engaging 3-4 sentence analysis of their predictions.
Comment on their champion pick — is it a safe pick or a bold one?
Mention one surprising or interesting group prediction.
End with a confidence rating out of 10 for their overall bracket.
Keep it conversational, exciting, and under 100 words.
  `

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function getAIPredictions(): Promise<{
  champion: Team
  runnerUp: Team
  thirdPlace: Team
  fourthPlace: Team
  analysis: string
  groupPicks: Record<string, string[]>
}> {
  const prompt = `
You are a FIFA World Cup 2026 expert. Predict the tournament results.

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "champion": { "name": "Brazil", "flag": "🇧🇷" },
  "runnerUp": { "name": "France", "flag": "🇫🇷" },
  "thirdPlace": { "name": "England", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  "fourthPlace": { "name": "Germany", "flag": "🇩🇪" },
  "analysis": "2-3 sentence explanation of why these teams will succeed",
  "groupPicks": {
    "A": ["Mexico", "South Korea", "South Africa", "Czechia"],
    "B": ["Canada", "Switzerland", "Qatar", "Bosnia-Herz."],
    "C": ["Brazil", "Morocco", "Scotland", "Haiti"],
    "D": ["USA", "Australia", "Paraguay", "Türkiye"],
    "E": ["Germany", "Ecuador", "Ivory Coast", "Curaçao"],
    "F": ["Netherlands", "Japan", "Sweden", "Tunisia"],
    "G": ["Belgium", "Egypt", "Iran", "New Zealand"],
    "H": ["Spain", "Uruguay", "Saudi Arabia", "Cape Verde"],
    "I": ["France", "Senegal", "Norway", "Iraq"],
    "J": ["Argentina", "Croatia", "Colombia", "Algeria"],
    "K": ["Portugal", "Colombia", "DR Congo", "Uzbekistan"],
    "L": ["England", "Croatia", "Ghana", "Panama"]
  }
}

Use only these exact team names. Return pure JSON only.
  `

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
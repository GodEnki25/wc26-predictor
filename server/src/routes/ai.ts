import { Router, Request, Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

// ── GROQ ──────────────────────────────────────────────────────────────────
async function groq(prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
  })
  const data = await res.json() as any
  if (!res.ok) throw new Error(data.error?.message || 'Groq error')
  return data.choices[0].message.content
}

// ── GEMINI ────────────────────────────────────────────────────────────────
async function gemini(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
  const result = await model.generateContent(prompt)
  return result.response.text()
}

// ── AI WITH FALLBACK ──────────────────────────────────────────────────────
async function getAIResponse(prompt: string): Promise<string> {
  try {
    console.log('Trying Groq...')
    return await groq(prompt)
  } catch (err) {
    console.warn('Groq failed, falling back to Gemini:', err)
    return await gemini(prompt)
  }
}

// ── ANALYZE USER PREDICTIONS ──────────────────────────────────────────────
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { champion, rankings } = req.body

    const groupSummary = Object.entries(rankings)
      .map(([g, teams]) => `Group ${g}: ${(teams as string[]).join(' > ')}`)
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

    const analysis = await getAIResponse(prompt)
    res.json({ analysis })
  } catch (error) {
    console.error('AI analysis error:', error)
    res.status(500).json({ error: 'Failed to generate analysis' })
  }
})

// ── GET AI OWN PREDICTIONS ────────────────────────────────────────────────
router.get('/predictions', async (req: Request, res: Response) => {
  try {
    const prompt = `
You are a FIFA World Cup 2026 expert. Predict the tournament results.

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "champion": { "name": "Brazil", "flag": "🇧🇷" },
  "runnerUp": { "name": "France", "flag": "🇫🇷" },
  "thirdPlace": { "name": "England", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  "fourthPlace": { "name": "Germany", "flag": "🇩🇪" },
  "analysis": "2-3 sentence explanation of why these teams will succeed"
}
Return pure JSON only.
    `

    const text = await getAIResponse(prompt)
    const clean = text.replace(/```json|```/g, '').trim()
    res.json(JSON.parse(clean))
  } catch (error) {
    console.error('AI predictions error:', error)
    res.status(500).json({ error: 'Failed to generate AI predictions' })
  }
})

export default router
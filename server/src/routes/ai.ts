import { Router, Request, Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

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

    const result = await model.generateContent(prompt)
    res.json({ analysis: result.response.text() })
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

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/```json|```/g, '').trim()
    res.json(JSON.parse(clean))
  } catch (error) {
    console.error('AI predictions error:', error)
    res.status(500).json({ error: 'Failed to generate AI predictions' })
  }
})

export default router
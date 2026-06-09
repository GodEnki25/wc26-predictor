import { Router, Request, Response } from 'express'

const router = Router()

async function groq(prompt: string): Promise<string> {
  console.log('GROQ KEY:', process.env.GROQ_API_KEY ? `FOUND: ${process.env.GROQ_API_KEY.slice(0, 8)}...` : 'MISSING')
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
  })
  const data = await res.json() as any
  if (!res.ok) throw new Error(data.error?.message || 'Groq error')
  return data.choices[0].message.content
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

    const analysis = await groq(prompt)
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

    const text = await groq(prompt)
    const clean = text.replace(/```json|```/g, '').trim()
    res.json(JSON.parse(clean))
  } catch (error) {
    console.error('AI predictions error:', error)
    res.status(500).json({ error: 'Failed to generate AI predictions' })
  }
})

export default router
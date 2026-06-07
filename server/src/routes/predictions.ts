import { Router, Response } from 'express'

import { authMiddleware, AuthRequest } from '../middleware/auth'
import { prisma } from '../prisma'

const router = Router()


// ── SAVE PREDICTION ───────────────────────────────────────────────────────
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { champion, championFlag, rankings, thirdPlaceTeams, bracketWinners } = req.body

    const prediction = await prisma.prediction.upsert({
      where: { userId: req.userId as string },
      update: { champion, championFlag, rankings, thirdPlaceTeams, bracketWinners },
      create: {
        userId: req.userId as string,
        champion,
        championFlag,
        rankings,
        thirdPlaceTeams,
        bracketWinners,
      }
    })

    res.json(prediction)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET MY PREDICTION ─────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { userId: req.userId as string }
    })
    res.json(prediction)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET ALL PREDICTIONS (leaderboard) ─────────────────────────────────────
router.get('/all', async (req, res) => {
  try {
    const predictions = await prisma.prediction.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json(predictions)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
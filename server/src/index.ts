import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth'
import predictionsRouter from './routes/predictions'
import aiRouter from './routes/ai'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'https://sorel-wc26-predictor.vercel.app',
      'https://sorel-wc26-predictor-sand.vercel.app',
    ]
    // Allow any Vercel preview deployment for this project
    if (!origin || allowed.includes(origin) || /https:\/\/wc26-predictor-.*\.vercel\.app/.test(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))


app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WC26 Predictor API is running 🚀' })
})

app.use('/api/auth', authRouter)
app.use('/api/predictions', predictionsRouter)
app.use('/api/ai', aiRouter)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})

export default app
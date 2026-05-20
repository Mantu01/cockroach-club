import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { clerkMiddleware } from '@clerk/express'
import connectDB from './config/db.config.js'
import webhookRouter from './routes/webhook.route.js'
import userRouter from './routes/user.route.js'
import studioRouter from './routes/studio.route.js'

dotenv.config({ path: './.env' })

const app = express()

app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
)
app.use(morgan('dev'))
app.use('/api/v1/webhook', express.raw({ type: 'application/json' }), webhookRouter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/users', clerkMiddleware(), userRouter)
app.use('/api/v1/studio', clerkMiddleware(), studioRouter)

app.get('/', (_req, res) => res.send('server is running...'))

const PORT = process.env.PORT ?? '4000'

app.listen(PORT, async () => {
  await connectDB()
  console.log(`Server running on port ${PORT}`)
})
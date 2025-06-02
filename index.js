import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import { app, server } from './socket/socket.js'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT || 5000

// ✅ Apply CORS early
app.use(cors({
  origin: 'https://chat-app-frontend-pafi.vercel.app',
  credentials: true
}))

// ✅ Core Middlewares
app.use(express.json())
app.use(cookieParser())

// ✅ Routes
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/users', userRoutes)

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
  connectDB()
})

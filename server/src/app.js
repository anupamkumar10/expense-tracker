const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const compression = require('compression')
const { sanitizeRequest } = require('./middleware/sanitizeRequest')

const { notFound } = require('./middleware/notFound')
const { errorHandler } = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const budgetRoutes = require('./routes/budgetRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const adminRoutes = require('./routes/adminRoutes')
const plannerRoutes = require('./routes/plannerRoutes')

function createApp() {
  const app = express()

  app.set('trust proxy', 1)

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    }),
  )
  app.use(helmet())
  app.use(compression())
  app.use(cookieParser())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: false }))
  app.use(sanitizeRequest)
  app.use(morgan('dev'))

  app.get('/health', (req, res) => res.json({ ok: true }))

  app.use('/api/auth', authRoutes)
  app.use('/api/transactions', transactionRoutes)
  app.use('/api/budget', budgetRoutes)
  app.use('/api/analytics', analyticsRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/planner', plannerRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = { createApp }


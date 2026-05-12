const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const authRoutes = require('./features/auth/auth.routes')
const { errorHandler } = require('./middlewares/error.middleware')

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use(errorHandler)

module.exports = app

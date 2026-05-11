const express = require('express')
const cors = require('cors')
const authRoutes = require('./features/auth/auth.routes')
const { errorHandler } = require('./middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use(errorHandler)

module.exports = app

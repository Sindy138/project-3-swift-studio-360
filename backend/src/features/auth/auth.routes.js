const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { register, login } = require('./auth.controller')
const { RegisterSchema, LoginSchema } = require('./auth.schema')
const { validate } = require('../../middlewares/validate.middleware')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again in 15 minutes' },
})

const router = Router()

router.post('/register', validate(RegisterSchema), register)
router.post('/login', loginLimiter, validate(LoginSchema), login)

module.exports = router

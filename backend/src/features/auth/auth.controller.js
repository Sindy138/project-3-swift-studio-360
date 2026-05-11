const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../../lib/prisma')
const { validateRegister, validateLogin } = require('./auth.schema')

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

async function register(req, res) {
  const error = validateRegister(req.body)
  if (error) return res.status(400).json({ error })

  const { email, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email already in use' })

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashed },
    select: { id: true, email: true, role: true, createdAt: true }
  })

  return res.status(201).json({ user, token: signToken(user) })
}

async function login(req, res) {
  const error = validateLogin(req.body)
  if (error) return res.status(400).json({ error })

  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ error: 'Invalid credentials' })

  const { password: _, ...safeUser } = user

  return res.status(200).json({ user: safeUser, token: signToken(safeUser) })
}

module.exports = { register, login }

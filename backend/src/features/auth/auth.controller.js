const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../../lib/prisma')
const asyncHandler = require('../../lib/asyncHandler')

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email already in use' })

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashed },
    select: { id: true, email: true, role: true, createdAt: true },
  })

  return res.status(201).json({ user, token: signToken(user) })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ error: 'Invalid credentials' })

  const { password: _, ...safeUser } = user

  return res.status(200).json({ user: safeUser, token: signToken(safeUser) })
})

module.exports = { register, login }

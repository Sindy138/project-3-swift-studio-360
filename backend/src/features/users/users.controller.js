const prisma = require('../../lib/prisma')
const asyncHandler = require('../../lib/asyncHandler')

const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true, profile: true },
    orderBy: { createdAt: 'desc' },
  })
  return res.json(users)
})

const getUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, email: true, role: true, createdAt: true, profile: true },
  })
  if (!user) return res.status(404).json({ error: 'User not found' })
  return res.json(user)
})

const updateUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const user = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ error: 'User not found' })

  const { email, role, fullName, phone, companyName } = req.body

  if (role !== undefined && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'You cannot change your own role' })
  }

  if (email || role) {
    await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(email && { email }),
        ...(role && { role }),
      },
    })
  }

  const profileData = { fullName, phone, companyName }
  const hasProfileFields = Object.values(profileData).some((v) => v !== undefined)

  if (hasProfileFields) {
    await prisma.profile.upsert({
      where: { userId: req.params.id },
      update: profileData,
      create: { ...profileData, userId: req.params.id },
    })
  }

  const updated = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, email: true, role: true, createdAt: true, profile: true },
  })
  return res.json(updated)
})

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(403).json({ error: 'You cannot delete your own account' })
  }

  const user = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ error: 'User not found' })

  try {
    await prisma.user.delete({ where: { id: req.params.id } })
  } catch (err) {
    if (err.code === 'P2003') {
      return res.status(409).json({ error: 'Cannot delete user with existing orders' })
    }
    throw err
  }

  return res.status(204).send()
})

module.exports = { listUsers, getUser, updateUser, deleteUser }

const prisma = require('../../lib/prisma')

async function listServices(req, res) {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
  return res.json(services)
}

async function getService(req, res) {
  const service = await prisma.service.findFirst({
    where: { id: req.params.id, isActive: true },
  })
  if (!service) return res.status(404).json({ error: 'Service not found' })
  return res.json(service)
}

async function createService(req, res) {
  const service = await prisma.service.create({ data: req.body })
  return res.status(201).json(service)
}

async function updateService(req, res) {
  const service = await prisma.service.findFirst({
    where: { id: req.params.id, isActive: true },
  })
  if (!service) return res.status(404).json({ error: 'Service not found' })

  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: req.body,
  })
  return res.json(updated)
}

async function deleteService(req, res) {
  const service = await prisma.service.findFirst({
    where: { id: req.params.id, isActive: true },
  })
  if (!service) return res.status(404).json({ error: 'Service not found' })

  await prisma.service.update({
    where: { id: req.params.id },
    data: { isActive: false },
  })
  return res.status(204).send()
}

module.exports = { listServices, getService, createService, updateService, deleteService }

const prisma = require('../../lib/prisma')
const asyncHandler = require('../../lib/asyncHandler')

const createOrder = asyncHandler(async (req, res) => {
  const { serviceId, configData } = req.body
  const userId = req.user.id

  const service = await prisma.service.findFirst({
    where: { id: serviceId, isActive: true },
  })
  if (!service) return res.status(404).json({ error: 'Service not found' })

  // Business rule: no duplicate active orders for the same service
  const existing = await prisma.order.findFirst({
    where: { userId, serviceId, status: { in: ['PENDING', 'PROGRESS'] } },
  })
  if (existing) {
    return res.status(409).json({
      error: 'You already have an active order for this service',
    })
  }

  const order = await prisma.order.create({
    data: { userId, serviceId, configData, total: service.price },
    include: { service: { select: { name: true, category: true, price: true } } },
  })
  return res.status(201).json(order)
})

const listOrders = asyncHandler(async (req, res) => {
  const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id }
  const orders = await prisma.order.findMany({
    where,
    include: { service: { select: { name: true, category: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return res.json(orders)
})

const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      service: { select: { name: true, category: true, price: true } },
      deliverables: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  return res.json(order)
})

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } })
  if (!order) return res.status(404).json({ error: 'Order not found' })

  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
  })
  return res.json(updated)
})

const addDeliverable = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } })
  if (!order) return res.status(404).json({ error: 'Order not found' })

  const deliverable = await prisma.deliverable.create({
    data: { ...req.body, orderId: req.params.id },
  })
  return res.status(201).json(deliverable)
})

const listDeliverables = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const deliverables = await prisma.deliverable.findMany({
    where: { orderId: req.params.id },
    orderBy: { createdAt: 'asc' },
  })
  return res.json(deliverables)
})

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  addDeliverable,
  listDeliverables,
}

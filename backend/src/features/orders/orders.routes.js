const { Router } = require('express')
const {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  addDeliverable,
  listDeliverables,
} = require('./orders.controller')
const { CreateOrderSchema, UpdateOrderStatusSchema, CreateDeliverableSchema } = require('./orders.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware')

const router = Router()

router.post('/', authenticate, validate(CreateOrderSchema), createOrder)
router.get('/', authenticate, listOrders)
router.get('/:id', authenticate, getOrder)
router.put('/:id/status', authenticate, isAdmin, validate(UpdateOrderStatusSchema), updateOrderStatus)

router.post('/:id/deliverables', authenticate, isAdmin, validate(CreateDeliverableSchema), addDeliverable)
router.get('/:id/deliverables', authenticate, listDeliverables)

module.exports = router

const { Router } = require('express')
const { listServices, getService, createService, updateService, deleteService } = require('./services.controller')
const { CreateServiceSchema, UpdateServiceSchema } = require('./services.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware')

const router = Router()

router.get('/', listServices)
router.get('/:id', getService)
router.post('/', authenticate, isAdmin, validate(CreateServiceSchema), createService)
router.put('/:id', authenticate, isAdmin, validate(UpdateServiceSchema), updateService)
router.delete('/:id', authenticate, isAdmin, deleteService)

module.exports = router

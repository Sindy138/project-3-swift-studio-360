const { Router } = require('express')
const { listUsers, getUser, updateUser, deleteUser } = require('./users.controller')
const { UpdateUserSchema } = require('./users.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware')

const router = Router()

router.get('/', authenticate, isAdmin, listUsers)
router.get('/:id', authenticate, getUser)
router.put('/:id', authenticate, validate(UpdateUserSchema), updateUser)
router.delete('/:id', authenticate, isAdmin, deleteUser)

module.exports = router

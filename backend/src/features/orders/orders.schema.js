const { z } = require('zod')

const CreateOrderSchema = z.object({
  serviceId: z.string().min(1, { message: 'Service ID is required' }),
  configData: z.record(z.any()).default({}),
})

const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROGRESS', 'DONE'], {
    errorMap: () => ({ message: 'Status must be PENDING, PROGRESS or DONE' }),
  }),
})

const CreateDeliverableSchema = z.object({
  label: z.string().min(1, { message: 'Label is required' }),
  url: z.string().url({ message: 'A valid URL is required' }),
})

module.exports = { CreateOrderSchema, UpdateOrderStatusSchema, CreateDeliverableSchema }

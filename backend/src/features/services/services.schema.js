const { z } = require('zod')

const CreateServiceSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive({ message: 'Price must be positive' }),
  category: z.string().min(1, { message: 'Category is required' }),
  formConfig: z.record(z.any()).default({}),
})

const UpdateServiceSchema = CreateServiceSchema.partial()

module.exports = { CreateServiceSchema, UpdateServiceSchema }

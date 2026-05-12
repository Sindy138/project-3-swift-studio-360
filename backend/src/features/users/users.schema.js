const { z } = require('zod')

const UpdateUserSchema = z.object({
  email: z.string().email({ message: 'A valid email is required' }).optional(),
  role: z.enum(['USER', 'ADMIN'], { errorMap: () => ({ message: 'Role must be USER or ADMIN' }) }).optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
})

module.exports = { UpdateUserSchema }

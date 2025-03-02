import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(5).max(100),
  email: z.string().email(),
  gender: z.enum(['male', 'female', 'other']),
  event: z.enum(['running', 'relay', 'jump', 'throw'])
})

export type RegisterFormData = z.infer<typeof registerSchema> 
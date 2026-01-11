import { z } from 'zod'

export const LoginInSchema = z.object({
  email: z.email('Email is required'),
  password: z
    .string()
    .min(1, 'Password is Required')
    .min(8, 'Password should be 8 characters minimum')
    .max(20, 'Password must be less than 20 characters.'),
})

export const SignUpSchema = LoginInSchema.extend({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(4, 'Name should be 4 characters minimum')
    .max(20, 'Name must be less than 20 characters'),
})

export type LoginType = z.infer<typeof LoginInSchema>
export type SignUpType = z.infer<typeof SignUpSchema>

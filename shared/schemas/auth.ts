import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: 'First name is required' }),
    lastName: z.string().trim().min(1, { message: 'Last name is required' }),
    userName: z.string().trim().nonempty({ message: 'Username is required' }).min(3, { message: 'Username must be at least 3 characters' }),
    email: z.email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'Confirm password must be at least 8 characters' }),
    dateOfBirth: z.string().trim().min(1, { message: 'Date of birth is required' }),
    street: z.string().trim().min(1, { message: 'Street address is required' }),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    zipCode: z.string().trim().optional(),
    country: z.string().trim().min(1, { message: 'Country is required' }),
    newsletterSubscribed: z.boolean().default(false),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

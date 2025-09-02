import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().trim().min(2, { message: 'Last name must be at least 2 characters' }),
  userName: z.string().trim().nonempty({ message: 'Username is required' }).min(5, { message: 'Username must be at least 5 characters' }),
  email: z.email({ message: 'Invalid email address' }),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  companyWebsite: z.string().optional(),
  phone: z.string().trim().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  country: z.string().trim().optional(),
  newsletterSubscribed: z.boolean().optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: 'Current password must be at least 6 characters' }),
    newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userName: z.string(),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  companyWebsite: z.string().optional(),
  email: z.email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  newsletterSubscribed: z.boolean().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type User = z.infer<typeof userSchema>

import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, { message: 'Please enter your first name (minimum 2 characters)' }),
  lastName: z.string().trim().min(2, { message: 'Please enter your last name (minimum 2 characters)' }),
  userName: z.string().trim().nonempty({ message: 'Username is required' }).min(5, { message: 'Username must be at least 5 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  companyName: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  companyWebsite: z.string().trim().url({ message: 'Please enter a valid website URL (e.g., https://example.com)' }).or(z.literal('')).optional(),
  phone: z.string().trim(),
  dateOfBirth: z.string().min(1, 'Please select your date of birth'),
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  country: z.string().trim().optional(),
  newsletterSubscribed: z.boolean().optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Please enter your current password' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match. Please ensure both password fields are identical',
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
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string(),
  dateOfBirth: z.string().min(1, 'Please select your date of birth'),
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

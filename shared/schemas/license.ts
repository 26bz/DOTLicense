import { z } from 'zod'

export const licenseSchema = z.object({
  id: z.string().trim().min(1, { message: 'License ID is required' }),
  code: z.string().trim().min(1, { message: 'License code is required' }),
  issuedAt: z.string().trim().min(1, { message: 'Issued date is required' }),
  expiresAt: z.string().trim().nullable(),
  revoked: z.boolean(),
  product: z.object({
    id: z.string().trim().min(1, { message: 'Product ID is required' }),
    name: z.string().trim().min(1, { message: 'Product name is required' }),
  }),
})

export const userLicensesSchema = z.object({
  licenses: z.array(licenseSchema),
})

export type License = z.infer<typeof licenseSchema>
export type UserLicenses = z.infer<typeof userLicensesSchema>

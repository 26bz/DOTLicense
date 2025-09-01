import { z } from 'zod'

export const licenseSchema = z.object({
  id: z.string(),
  code: z.string(),
  issuedAt: z.string(),
  expiresAt: z.string().nullable(),
  revoked: z.boolean(),
  product: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

export const userLicensesSchema = z.object({
  licenses: z.array(licenseSchema),
})

export type License = z.infer<typeof licenseSchema>
export type UserLicenses = z.infer<typeof userLicensesSchema>

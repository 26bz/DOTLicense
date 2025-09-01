import { z } from 'zod'

export const createServiceSchema = z.object({
  title: z.string().trim().min(2, { message: 'Title must be at least 2 characters' }),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().min(5, { message: 'Description must be at least 5 characters' }),
  price: z.string().trim().min(1, { message: 'Price is required' }),
  currency: z.string().trim().default('USD'),
  features: z.array(z.string().trim()).default([]),
  buttonLabel: z.string().trim().min(1, { message: 'Button label is required' }),
  deliveryTimeframe: z.string().trim().optional(),
  includesRevisions: z.boolean().default(true),
  maxRevisions: z.number().optional(),
  includesConsultation: z.boolean().default(false),
  consultationHours: z.number().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isOneTime: z.boolean().default(true),
  isSubscription: z.boolean().default(false),
  subscriptionInterval: z.string().trim().optional(),
})

export const updateServiceSchema = createServiceSchema.partial()

export const serviceSchema = createServiceSchema.extend({
  id: z.number(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
export type Service = z.infer<typeof serviceSchema>

import { z } from 'zod'

export const createServiceSchema = z.object({
  title: z.string().min(2),
  shortDescription: z.string().optional(),
  description: z.string().min(5),
  price: z.string().min(1),
  currency: z.string().default('USD'),
  features: z.array(z.string()).default([]),
  buttonLabel: z.string().min(1),
  deliveryTimeframe: z.string().optional(),
  includesRevisions: z.boolean().default(true),
  maxRevisions: z.number().optional(),
  includesConsultation: z.boolean().default(false),
  consultationHours: z.number().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isOneTime: z.boolean().default(true),
  isSubscription: z.boolean().default(false),
  subscriptionInterval: z.string().optional(),
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

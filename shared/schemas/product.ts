import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  coverImage: z.string().min(1),
  tags: z.string().min(1),
  version: z.string().min(1),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  changeLog: z.string().optional(),
  fileUrl: z.string().min(1),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  price: z.number().min(0),
  isOneTime: z.boolean().default(true),
  isSubscription: z.boolean().default(false),
  subscriptionInterval: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const productSchema = createProductSchema.extend({
  id: z.string(),
  downloadCount: z.number(),
  purchaseCount: z.number(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
  category: z.object({ name: z.string(), slug: z.string().optional() }),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type Product = z.infer<typeof productSchema>

import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categorySchema = createCategorySchema.extend({
  id: z.string(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type Category = z.infer<typeof categorySchema>

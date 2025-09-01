import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, { message: 'Category name is required' }),
  slug: z.string().trim().min(1, { message: 'Slug is required' }),
  description: z.string().trim().optional(),
  icon: z.string().trim().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categorySchema = createCategorySchema.extend({
  id: z.string(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type Category = z.infer<typeof categorySchema>

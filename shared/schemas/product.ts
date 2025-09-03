import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

const fileSchema = z.instanceof(File).nullable().optional()

export const createProductSchema = z.object({
  name: z.string().trim().min(1, { message: 'Product name is required' }),
  slug: z.string().trim().min(1, { message: 'Slug is required' }),
  description: z.string().trim().min(1, { message: 'Description is required' }),
  shortDescription: z.string().trim().optional(),
  coverImage: z.string().trim().min(1, { message: 'Cover image is required' }),
  tags: z.string().trim().min(1, { message: 'At least one tag is required' }),
  version: z.string().trim().min(1, { message: 'Version is required' }),
  categoryId: z.string().trim().min(1, { message: 'Category is required' }),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  changeLog: z.string().trim().optional(),
  fileUrl: z.string().trim().min(1, { message: 'File URL is required' }),
  fileName: z.string().trim().optional(),
  mimeType: z.string().trim().optional(),
  fileSize: z.number().optional(),
  price: z.number().min(0, { message: 'Price must be 0 or greater' }),
  isOneTime: z.boolean().default(true),
  isSubscription: z.boolean().default(false),
  subscriptionInterval: z.string().trim().optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const productSchema = createProductSchema.extend({
  id: z.string(),
  downloadCount: z.number(),
  purchaseCount: z.number(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
  category: z.object({
    name: z.string().trim().min(1, { message: 'Category name is required' }),
    slug: z.string().trim().optional(),
  }),
})

export const productWithCategorySchema = productSchema.extend({
  categoryId: z.string(),
})

export const productFormSchema = createProductSchema.extend({
  coverImageFile: fileSchema,
  productFile: fileSchema,
  fileSizeDisplay: z.string().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type Product = z.infer<typeof productSchema>
export type ProductWithCategory = z.infer<typeof productWithCategorySchema>
export type Category = z.infer<typeof categorySchema>
export type ProductForm = z.infer<typeof productFormSchema>

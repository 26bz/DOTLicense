import prisma from '~~/lib/prisma'
import { categorySchema } from '#shared/schemas/categories'

export default defineEventHandler(async () => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return categories.map(c => categorySchema.parse(c))
})

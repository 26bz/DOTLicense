import prisma from '~~/lib/prisma'
import { productSchema } from '#shared/schemas/product'

export default defineEventHandler(async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  return products.map(p => productSchema.parse(p))
})

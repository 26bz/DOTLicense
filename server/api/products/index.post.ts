import prisma from '~~/lib/prisma'
import { createProductSchema } from '#shared/schemas/product'
import { manageProducts } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, manageProducts, session.user)

  const body = await readBody(event)
  const data = createProductSchema.parse(body)

  const product = await prisma.product.create({
    data: { ...data, downloadCount: 0, purchaseCount: 0 },
  })

  await logActivity(event, {
    userId: session.user.id,
    type: 'PRODUCT_CREATED',
    description: `Admin created product: ${product.name}`,
    resourceId: product.id,
    resourceType: 'product',
    metadata: { productName: product.name, action: 'create' },
  })

  return product
})

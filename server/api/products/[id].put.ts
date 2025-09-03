import prisma from '~~/lib/prisma'
import { updateProductSchema } from '#shared/schemas/product'
import { manageProducts } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, manageProducts, session.user)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const data = updateProductSchema.parse(body)

  const product = await prisma.product.update({
    where: { id },
    data,
  })

  await logActivity(event, {
    userId: session.user.id,
    type: 'PRODUCT_UPDATED',
    description: `Admin updated product: ${product.name}`,
    resourceId: id,
    resourceType: 'product',
    metadata: { productName: product.name, action: 'update' },
  })

  return product
})

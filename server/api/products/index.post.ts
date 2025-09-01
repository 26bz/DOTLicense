import prisma from '~~/lib/prisma'
import { createProductSchema } from '#shared/schemas/product'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, 'manageProducts', session.user)

  const body = await readBody(event)
  const data = createProductSchema.parse(body)

  const product = await prisma.product.create({
    data: { ...data, downloadCount: 0, purchaseCount: 0 },
  })

  return product
})

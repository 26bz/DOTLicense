import prisma from '~~/lib/prisma'
import { updateProductSchema } from '#shared/schemas/product'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, 'manageProducts', session.user)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const data = updateProductSchema.parse(body)

  const product = await prisma.product.update({
    where: { id },
    data,
  })

  return product
})

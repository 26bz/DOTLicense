import prisma from '~~/lib/prisma'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, 'manageProducts', session.user)

  const id = getRouterParam(event, 'id')
  await prisma.product.delete({ where: { id } })

  return { success: true }
})

import prisma from '~~/lib/prisma'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, 'deleteCategory', session.user)

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Category ID required' })

  await prisma.category.delete({ where: { id } })
  return {}
})

import prisma from '~~/lib/prisma'
import { viewCategory } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, viewCategory, session.user)

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Category ID required' })

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw createError({ statusCode: 404, statusMessage: 'Category not found' })

  return category
})

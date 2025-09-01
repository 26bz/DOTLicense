import prisma from '~~/lib/prisma'
import { updateCategorySchema } from '#shared/schemas/categories'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, 'updateCategory', session.user)

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Category ID required' })

  const body = await readBody(event)
  const data = updateCategorySchema.parse(body)

  const updated = await prisma.category.update({ where: { id }, data })
  return updated
})

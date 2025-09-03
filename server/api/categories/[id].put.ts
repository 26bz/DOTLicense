import prisma from '~~/lib/prisma'
import { updateCategorySchema } from '#shared/schemas/categories'
import { updateCategory } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, updateCategory, session.user)

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Category ID required' })

  const body = await readBody(event)
  const data = updateCategorySchema.parse(body)

  const updated = await prisma.category.update({ where: { id }, data })

  await logActivity(event, {
    userId: session.user.id,
    type: 'CATEGORY_UPDATED',
    description: `Admin updated category: ${updated.name}`,
    resourceId: id,
    resourceType: 'category',
    metadata: { categoryName: updated.name, action: 'update' },
  })

  return updated
})

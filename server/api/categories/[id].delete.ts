import prisma from '~~/lib/prisma'
import { deleteCategory } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, deleteCategory, session.user)

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Category ID required' })

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw createError({ statusCode: 404, statusMessage: 'Category not found' })

  await prisma.category.delete({ where: { id } })

  await logActivity(event, {
    userId: session.user.id,
    type: 'CATEGORY_DELETED',
    description: `Admin deleted category: ${category.name}`,
    resourceId: id,
    resourceType: 'category',
    metadata: { categoryName: category.name, action: 'delete' },
  })

  return { success: true }
})

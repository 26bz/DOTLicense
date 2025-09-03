import prisma from '~~/lib/prisma'
import { categorySchema, createCategorySchema } from '#shared/schemas/categories'
import { createCategory } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, createCategory, session.user)

  const body = await readBody(event)
  const data = createCategorySchema.parse(body)

  const category = await prisma.category.create({ data })

  await logActivity(event, {
    userId: session.user.id,
    type: 'CATEGORY_CREATED',
    description: `Admin created category: ${category.name}`,
    resourceId: category.id,
    resourceType: 'category',
    metadata: { categoryName: category.name, action: 'create' },
  })

  return categorySchema.parse(category)
})

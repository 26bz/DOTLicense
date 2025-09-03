import type { ActivityType } from '@prisma/client'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  const query = getQuery(event)

  try {
    const result = await getUserActivity(session.user.id, {
      limit: parseInt(query.limit as string) || 50,
      offset: parseInt(query.offset as string) || 0,
      types: query.types ? ((query.types as string).split(',') as ActivityType[]) : undefined,
      startDate: query.startDate ? new Date(query.startDate as string) : undefined,
      endDate: query.endDate ? new Date(query.endDate as string) : undefined,
      resourceType: query.resourceType as string,
    })

    return result
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch activity',
    })
  }
})

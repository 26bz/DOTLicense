import { getActivityStats } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  const query = getQuery(event)

  const allowedTimeframes = ['day', 'week', 'month', 'year'] as const
  const timeframe = allowedTimeframes.includes(query.timeframe as any) ? (query.timeframe as 'day' | 'week' | 'month' | 'year') : 'month'

  try {
    const stats = await getActivityStats(session.user.id, timeframe)
    return { stats }
  } catch (error) {
    console.error(`Failed to fetch activity stats for user ${session.user.id}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch activity stats',
    })
  }
})

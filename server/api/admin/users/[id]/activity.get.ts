import { createError } from 'h3'
import prisma from '~~/lib/prisma'
import { manageUsers } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  try {
    const session = await requireUserSession(event)
    await authorize(event, manageUsers, session.user)

    const userId = getRouterParam(event, 'id')
    const query = getQuery(event)
    const offset = parseInt(query.offset as string) || 0
    const limit = parseInt(query.limit as string) || 20

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      })
    }

    const userIdInt = parseInt(userId)

    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      select: { id: true, firstName: true, lastName: true },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    const [activities, totalCount, stats] = await Promise.all([
      prisma.activityLog.findMany({
        where: { userId: userIdInt },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          type: true,
          description: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
      }),
      prisma.activityLog.count({
        where: { userId: userIdInt },
      }),
      prisma.activityLog.groupBy({
        by: ['type'],
        where: { userId: userIdInt },
        _count: {
          type: true,
        },
      }),
    ])

    const activityStats = {
      totalActivities: totalCount,
      purchases: stats.find(s => s.type === 'PURCHASE_COMPLETED')?._count.type || 0,
      logins: stats.find(s => s.type === 'LOGIN')?._count.type || 0,
    }

    const hasMore = offset + limit < totalCount

    return {
      activities,
      stats: activityStats,
      hasMore,
      pagination: {
        offset,
        limit,
        totalCount,
      },
    }
  } catch (error: any) {
    console.error('Error fetching user activity:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user activity',
    })
  }
})

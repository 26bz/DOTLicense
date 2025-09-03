import prisma from '~~/lib/prisma'
import { getRequestIP, getHeader, type H3Event } from 'h3'
import type { ActivityType, Prisma } from '@prisma/client'
import { ActivityDataSchema, type ActivityData } from '~~/shared/schemas/activity'

function parseUserAgent(userAgent?: string) {
  if (!userAgent) return { browser: 'unknown', os: 'unknown', device: 'desktop' }

  const browser = /chrome|crios/i.test(userAgent)
    ? 'Chrome'
    : /firefox/i.test(userAgent)
    ? 'Firefox'
    : /safari/i.test(userAgent)
    ? 'Safari'
    : /edge/i.test(userAgent)
    ? 'Edge'
    : 'unknown'

  const os = /windows/i.test(userAgent)
    ? 'Windows'
    : /macintosh/i.test(userAgent)
    ? 'Mac'
    : /linux/i.test(userAgent)
    ? 'Linux'
    : /android/i.test(userAgent)
    ? 'Android'
    : /iphone|ipad/i.test(userAgent)
    ? 'iOS'
    : 'unknown'

  const device = /tablet|ipad/i.test(userAgent) ? 'tablet' : /mobile|android|iphone|ipod/i.test(userAgent) ? 'mobile' : 'desktop'

  return { browser, os, device }
}

export async function logActivity(event: H3Event, rawData: ActivityData) {
  try {
    const data = ActivityDataSchema.parse(rawData)

    const userAgent = getHeader(event, 'user-agent')
    const { browser, os, device } = parseUserAgent(userAgent)

    await prisma.activityLog.create({
      data: {
        type: data.type as ActivityType,
        description: data.description,
        metadata: data.metadata as any,
        resourceId: data.resourceId,
        resourceType: data.resourceType,
        ipAddress: getRequestIP(event),
        userAgent,
        sessionId: getHeader(event, 'cookie')?.match(/session=([^;]+)/)?.[1],
        referrer: getHeader(event, 'referer'),
        browser,
        os,
        device,
        user: { connect: { id: data.userId } },
      },
    })
  } catch (err) {
    console.error('Activity logging failed:', { userId: rawData.userId, type: rawData.type, error: err })
  }
}

export async function logActivityDirect(rawData: ActivityData) {
  try {
    const data = ActivityDataSchema.parse(rawData)

    await prisma.activityLog.create({
      data: {
        type: data.type as ActivityType,
        description: data.description,
        metadata: data.metadata as any,
        resourceId: data.resourceId,
        resourceType: data.resourceType,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
        referrer: data.referrer,
        browser: data.browser,
        os: data.os,
        device: data.device,
        user: { connect: { id: data.userId } },
      },
    })
  } catch (err) {
    console.error('Direct activity logging failed:', { userId: rawData.userId, type: rawData.type, error: err })
  }
}

export async function getUserActivity(
  userId: number,
  options: {
    limit?: number
    offset?: number
    types?: ActivityType[]
    startDate?: Date
    endDate?: Date
    resourceType?: string
  }
) {
  const { limit = 50, offset = 0, types, startDate, endDate, resourceType } = options

  const where: Prisma.ActivityLogWhereInput = { userId }
  if (types?.length) {
    where.type = { in: types }
  }
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }
  if (resourceType) {
    where.resourceType = resourceType
  }

  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        user: {
          select: { id: true, userName: true, email: true, role: true },
        },
      },
    }),
    prisma.activityLog.count({ where }),
  ])

  return { activities, total }
}

export async function getActivityStats(userId: number, timeframe?: string) {
  const where: Prisma.ActivityLogWhereInput = { userId }

  if (timeframe) {
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    where.createdAt = { gte: startDate }
  }

  const stats = await prisma.activityLog.groupBy({
    by: ['type'],
    where,
    _count: { type: true },
  })

  return stats.reduce((acc, stat) => {
    acc[stat.type] = stat._count.type
    return acc
  }, {} as Record<ActivityType, number>)
}

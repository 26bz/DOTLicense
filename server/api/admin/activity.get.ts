import prisma from '~~/lib/prisma'
import type { H3Event } from 'h3'
import { ActivityType } from '@prisma/client'
import { viewAdminDashboard } from '~~/shared/utils/abilities'

export default defineEventHandler(async (event: H3Event) => {
  const session = await requireUserSession(event)
  await authorize(event, viewAdminDashboard, session.user)
  const query = getQuery(event)
  const limit = Math.min(parseInt(query.limit as string) || 20, 100)
  const offset = parseInt(query.offset as string) || 0
  const types = Array.isArray(query.types) ? (query.types as string[]) : (query.types as string)?.split(',') || undefined
  const startDate = query.startDate ? new Date(query.startDate as string) : undefined
  const endDate = query.endDate ? new Date(query.endDate as string) : undefined

  const validTypes = types?.filter(t => Object.values(ActivityType).includes(t as ActivityType)).map(t => t as ActivityType) as ActivityType[] | undefined

  const where: any = {}
  if (validTypes?.length) where.type = { in: validTypes }
  if (startDate) where.createdAt = { ...where.createdAt, gte: startDate }
  if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

  const [activities, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      include: {
        user: { select: { id: true, userName: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ])

  return {
    activities,
    total,
    hasMore: offset + limit < total,
  }
})

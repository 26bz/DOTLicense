import prisma from '~~/lib/prisma'
import type { H3Event } from 'h3'
import { manageUsers } from '~~/shared/utils/abilities'
import { userQuerySchema } from '~~/shared/schemas/user'

export default defineEventHandler(async (event: H3Event) => {
  const session = await requireUserSession(event)
  await authorize(event, manageUsers, session.user)

  const rawQuery = getQuery(event)
  const { page, limit, search, role } = userQuerySchema.parse(rawQuery)

  const offset = (page - 1) * limit

  const where: any = {}

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { userName: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (role) {
    where.role = role
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        email: true,
        role: true,
        companyName: true,
        jobTitle: true,
        emailVerified: true,
        isPermitted: true,
        createdAt: true,
        lastLoginAt: true,
        city: true,
        state: true,
        country: true,
        newsletterSubscribed: true,
        _count: {
          select: {
            purchases: true,
            licenses: true,
            activityLogs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return {
    users,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
})

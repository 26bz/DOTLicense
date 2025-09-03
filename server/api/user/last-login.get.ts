import prisma from '~~/lib/prisma'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)

  const lastLogin = await prisma.activityLog.findFirst({
    where: {
      userId: session.user.id,
      type: 'LOGIN',
      createdAt: {
        lt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: true,
      ipAddress: true,
      browser: true,
      os: true,
      device: true,
    },
  })

  return lastLogin
})

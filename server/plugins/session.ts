import type { User } from '#auth-utils'
import prisma from '~~/lib/prisma'
import { logActivityDirect } from '~~/server/utils/activity'

export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (session, event) => {
    const userId = session.user?.id
    if (!userId) return

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          userName: true,
          email: true,
          role: true,
          emailVerified: true,
          isPermitted: true,
        },
      })

      if (!user) {
        await clearUserSession(event)
        session.user = undefined
      } else {
        session.user = user as User
      }
    } catch (err) {
      console.error(`Error fetching user for session: ${userId}`, err)
      session.user = undefined
    }
  })

  sessionHooks.hook('clear', async (session, event) => {
    const userId = session.user?.id
    if (!userId) return

    console.info(`User logging out: ${userId}`)

    try {
      await logActivityDirect({
        userId,
        type: 'LOGOUT',
        description: 'User session cleared',
        ipAddress: getRequestIP(event) || undefined,
        userAgent: getHeader(event, 'user-agent') || undefined,
      })
    } catch (err) {
      console.error(`Failed to log logout activity for user: ${userId}`, err)
    }
  })
})

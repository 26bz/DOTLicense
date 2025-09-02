import type { User } from '#auth-utils'
import prisma from '~~/lib/prisma'

export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (session, event) => {
    if (session.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
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
    }
  })

  sessionHooks.hook('clear', async session => {
    console.log(`User logged out: ${session.user?.id}`)
  })
})

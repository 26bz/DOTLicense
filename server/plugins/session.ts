import prisma from '~~/lib/prisma'

export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (session, event) => {
    if (session.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          userName: true,
          role: true,
        },
      })

      if (!user) {
        await clearUserSession(event)
        session.user = undefined
      } else {
        session.user = user
      }
    }
  })

  sessionHooks.hook('clear', async session => {
    console.log(`User logged out: ${session.user?.id}`)
  })
})

import prisma from '~~/lib/prisma'

export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (session, event) => {
    if (session.user?.id) {
      const userExists = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!userExists) {
        await clearUserSession(event)
        session.user = undefined
      }
    }
  })

  sessionHooks.hook('clear', async session => {
    console.log(`User logged out: ${session.user?.id}`)
  })
})

import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await getUserSession(event)

  if (session?.user?.id) {
    await logActivity(event, {
      userId: session.user.id,
      type: 'LOGOUT',
      description: 'User logged out',
      resourceId: session.user.id.toString(),
      resourceType: 'user',
      metadata: { success: true },
    })
  }

  await clearUserSession(event)
  return { success: true }
})

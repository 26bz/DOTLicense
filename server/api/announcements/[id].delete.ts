import prisma from '~~/lib/prisma'
import { deleteAnnouncement } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, deleteAnnouncement, session.user)

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid announcement ID' })

  const announcement = await prisma.announcement.findUnique({ where: { id } })
  if (!announcement) throw createError({ statusCode: 404, statusMessage: 'Announcement not found' })

  await prisma.announcement.delete({ where: { id } })

  await logActivity(event, {
    userId: session.user.id,
    type: 'ANNOUNCEMENT_DELETED',
    description: `Admin deleted announcement: ${announcement.title}`,
    resourceId: id,
    resourceType: 'announcement',
    metadata: { title: announcement.title, action: 'delete' },
  })

  return { success: true }
})

import prisma from '~~/lib/prisma'
import { announcementSchema } from '#shared/schemas/announcements'
import { updateAnnouncement } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, updateAnnouncement, session.user)

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid announcement ID' })

  const body = await readBody(event)
  const data = announcementSchema.parse(body)

  const updated = await prisma.announcement.update({ where: { id }, data })

  await logActivity(event, {
    userId: session.user.id,
    type: 'ANNOUNCEMENT_UPDATED',
    description: `Admin updated announcement: ${updated.title}`,
    resourceId: id,
    resourceType: 'announcement',
    metadata: { title: updated.title, action: 'update' },
  })

  return updated
})

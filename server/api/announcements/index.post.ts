import prisma from '~~/lib/prisma'
import { announcementSchema } from '#shared/schemas/announcements'
import { createAnnouncement } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, createAnnouncement, session.user)

  const body = await readBody(event)
  const data = announcementSchema.parse(body)

  const announcement = await prisma.announcement.create({ data })

  await logActivity(event, {
    userId: session.user.id,
    type: 'ANNOUNCEMENT_CREATED',
    description: `Admin created announcement: ${announcement.title}`,
    resourceId: announcement.id,
    resourceType: 'announcement',
    metadata: { title: announcement.title, action: 'create' },
  })

  return announcement
})

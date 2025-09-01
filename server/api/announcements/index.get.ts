import prisma from '~~/lib/prisma'
import { fullAnnouncementSchema } from '#shared/schemas/announcements'

export default defineEventHandler(async () => {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return announcements.map(a => fullAnnouncementSchema.parse(a))
})

import prisma from '~~/lib/prisma'
import { announcementSchema } from '#shared/schemas/announcements'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, session.user)

  const body = await readBody(event)
  const data = announcementSchema.parse(body)

  const announcement = await prisma.announcement.create({ data })
  return announcement
})

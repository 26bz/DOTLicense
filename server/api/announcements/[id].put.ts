import prisma from '~~/lib/prisma'
import { announcementSchema } from '#shared/schemas/announcements'

export default defineEventHandler(async event => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid announcement ID' })

  const body = await readBody(event)
  const data = announcementSchema.parse(body)

  const updated = await prisma.announcement.update({ where: { id }, data })
  return updated
})

import prisma from '~~/lib/prisma'
import { deleteService } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, deleteService, session.user)

  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid service ID' })

  await prisma.service.delete({
    where: { id },
  })

  return { success: true }
})

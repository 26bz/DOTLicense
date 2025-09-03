import prisma from '~~/lib/prisma'
import { deleteService } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, deleteService, session.user)

  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid service ID' })

  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) throw createError({ statusCode: 404, statusMessage: 'Service not found' })

  await prisma.service.delete({ where: { id } })

  await logActivity(event, {
    userId: session.user.id,
    type: 'SERVICE_DELETED',
    description: `Admin deleted service: ${service.title}`,
    resourceId: id.toString(),
    resourceType: 'service',
    metadata: { serviceName: service.title, action: 'delete' },
  })

  return { success: true }
})

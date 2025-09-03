import prisma from '~~/lib/prisma'
import { updateServiceSchema } from '#shared/schemas/services'
import { updateService } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, updateService, session.user)

  const id = Number(event.context.params?.id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid service ID' })

  const body = await readBody(event)
  const data = updateServiceSchema.parse({
    ...body,
    features: Array.isArray(body.features) ? body.features : [],
  })

  const service = await prisma.service.update({ where: { id }, data })

  await logActivity(event, {
    userId: session.user.id,
    type: 'SERVICE_UPDATED',
    description: `Admin updated service: ${service.title}`,
    resourceId: service.id.toString(),
    resourceType: 'service',
    metadata: { serviceName: service.title, updatedFields: Object.keys(data), action: 'update' },
  })

  return service
})

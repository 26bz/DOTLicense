import prisma from '~~/lib/prisma'
import { createServiceSchema } from '#shared/schemas/services'
import { createService } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, createService, session.user)

  const body = await readBody(event)
  const data = createServiceSchema.parse({
    ...body,
    features: Array.isArray(body.features) ? body.features : [],
  })

  const service = await prisma.service.create({ data })

  await logActivity(event, {
    userId: session.user.id,
    type: 'SERVICE_CREATED',
    description: `Admin created service: ${service.title}`,
    resourceId: service.id.toString(),
    resourceType: 'service',
    metadata: { serviceName: service.title, action: 'create' },
  })

  return service
})

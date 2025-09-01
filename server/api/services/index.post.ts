import prisma from '~~/lib/prisma'
import { createServiceSchema } from '#shared/schemas/services'
import { createService } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, createService, session.user)

  const body = await readBody(event)
  const data = createServiceSchema.parse({
    ...body,
    features: Array.isArray(body.features) ? body.features : [],
  })

  const service = await prisma.service.create({ data })
  return service
})

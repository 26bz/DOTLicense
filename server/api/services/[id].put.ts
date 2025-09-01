import prisma from '~~/lib/prisma'
import { updateServiceSchema } from '#shared/schemas/services'
import { updateService } from '~~/shared/utils/abilities'

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

  const updated = await prisma.service.update({ where: { id }, data })
  return updated
})

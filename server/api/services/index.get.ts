import prisma from '~~/lib/prisma'
import { serviceSchema } from '#shared/schemas/services'

export default defineEventHandler(async () => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return services.map(s => serviceSchema.parse({ ...s, features: Array.isArray(s.features) ? s.features : [] }))
})

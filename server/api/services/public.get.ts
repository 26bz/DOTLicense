import prisma from '~~/lib/prisma'

export default defineEventHandler(async () => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return services
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch services',
    })
  }
})

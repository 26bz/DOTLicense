import prisma from '~~/lib/prisma'

export default defineEventHandler(async () => {
  try {
    const services = await prisma.service.findMany({
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

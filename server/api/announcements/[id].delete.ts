import prisma from '~~/lib/prisma'

export default defineEventHandler(async event => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid announcement ID' })

  await prisma.announcement.delete({ where: { id } })
  return
})

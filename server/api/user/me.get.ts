import prisma from '~~/lib/prisma'
import { updateUser } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, updateUser, session.user, session.user)

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  return { user }
})

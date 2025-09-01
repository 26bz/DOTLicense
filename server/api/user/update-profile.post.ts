import prisma from '~~/lib/prisma'
import { updateProfileSchema } from '#shared/schemas/user'
import { updateUser } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, updateUser, session.user, session.user)

  const body = await readBody(event)
  const data = updateProfileSchema.parse(body)

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
    },
  })

  await setUserSession(event, {
    ...session,
    user: { ...session.user, ...updatedUser },
  })

  return { user: updatedUser }
})

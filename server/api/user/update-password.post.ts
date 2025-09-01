import prisma from '~~/lib/prisma'
import bcrypt from 'bcrypt'
import { changePasswordSchema } from '#shared/schemas/user'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  const { currentPassword, newPassword } = changePasswordSchema.parse(await readBody(event))

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { password: true },
  })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) throw createError({ statusCode: 400, statusMessage: 'Invalid current password' })

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } })

  return
})

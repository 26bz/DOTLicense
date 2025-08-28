import { z } from 'zod'
import prisma from '~~/lib/prisma'
import bcrypt from 'bcrypt'

const schema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})
export default defineEventHandler(async event => {
  const session = await requireUserSession(event)

  const body = await readBody(event)
  const { currentPassword, newPassword } = schema.parse(body)

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { id: true, password: true },
  })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid current password',
    })

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
  return { success: true }
})

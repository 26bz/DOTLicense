import bcrypt from 'bcrypt'
import { changePasswordSchema } from '#shared/schemas/user'
import prisma from '~~/lib/prisma'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  const body = await readBody(event)
  const { currentPassword, newPassword } = changePasswordSchema.parse(body)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    await logActivity(event, {
      userId: session.user.id,
      type: 'PASSWORD_CHANGED',
      description: 'Failed password change attempt: incorrect current password',
      resourceId: session.user.id.toString(),
      resourceType: 'user',
      metadata: { success: false },
    })
    throw createError({ statusCode: 400, statusMessage: 'Current password is incorrect' })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  await logActivity(event, {
    userId: session.user.id,
    type: 'PASSWORD_CHANGED',
    description: 'User changed their password',
    resourceId: session.user.id.toString(),
    resourceType: 'user',
  })

  return { success: true }
})

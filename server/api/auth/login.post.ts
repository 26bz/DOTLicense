import prisma from '~~/lib/prisma'
import bcrypt from 'bcrypt'
import { getRequestIP, getHeader } from 'h3'
import { loginSchema } from '#shared/schemas/auth'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { email, password } = loginSchema.parse(body)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    await logActivity(event, {
      userId: 0, // system or anonymous
      type: 'LOGIN',
      description: `Failed login attempt for unknown email`,
      resourceId: email,
      resourceType: 'email',
    })
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    await logActivity(event, {
      userId: user.id,
      type: 'LOGIN',
      description: 'Failed login attempt - invalid password',
      resourceId: user.id.toString(),
      resourceType: 'user',
    })
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const ip = getRequestIP(event) || undefined

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginIp: ip, lastLoginAt: new Date() },
  })

  await setUserSession(event, {
    user: { id: user.id, role: user.role },
    loggedInAt: new Date(),
  })

  await logActivity(event, {
    userId: user.id,
    type: 'LOGIN',
    description: 'User logged in',
    resourceId: user.id.toString(),
    resourceType: 'user',
  })

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      lastLoginIp: ip,
    },
  }
})

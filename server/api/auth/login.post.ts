import prisma from '~~/lib/prisma'
import bcrypt from 'bcrypt'
import { loginSchema } from '#shared/schemas/auth'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { email, password } = loginSchema.parse(body)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })

  const ip = getRequestIP(event)
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginIp: ip, lastLoginAt: new Date() } })

  await setUserSession(event, {
    user: { id: user.id, role: user.role },
    loggedInAt: new Date(),
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

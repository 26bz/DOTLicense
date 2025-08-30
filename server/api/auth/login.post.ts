import { z } from 'zod'
import bcrypt from 'bcrypt'
import prisma from '~~/lib/prisma'

const schema = z.object({
  email: z.string().min(2),
  password: z.string().min(6),
})

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const { email, password } = schema.parse(body)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      role: user.role,
    },
    loggedInAt: new Date(),
  })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
})

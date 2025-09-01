import prisma from '~~/lib/prisma'
import { registerSchema } from '#shared/schemas/auth'
import bcrypt from 'bcrypt'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const validatedData = registerSchema.parse(body)

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: validatedData.email }, { userName: validatedData.userName }],
    },
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      statusMessage: existing.email === validatedData.email ? 'Email already registered' : 'Username already taken',
    })
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 10)

  const user = await prisma.user.create({
    data: {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      userName: validatedData.userName,
      email: validatedData.email,
      password: hashedPassword,
      dateOfBirth: new Date(validatedData.dateOfBirth),
      street: validatedData.street,
      city: validatedData.city,
      state: validatedData.state,
      zipCode: validatedData.zipCode,
      country: validatedData.country,
      newsletterSubscribed: validatedData.newsletterSubscribed,
    },
  })

  await setUserSession(event, {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
    loggedInAt: new Date(),
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    },
  }
})

import prisma from '~~/lib/prisma'
import { updateProfileSchema } from '#shared/schemas/user'
import { updateUser } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, updateUser, session.user, session.user)

  const body = await readBody(event)
  const data = updateProfileSchema.parse(body)

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      userName: true,
      email: true,
      companyName: true,
      jobTitle: true,
      companyWebsite: true,
      phone: true,
      dateOfBirth: true,
      street: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
      newsletterSubscribed: true,
    },
  })

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
    },
  })

  const updatedFields: string[] = []
  if (currentUser) {
    Object.keys(data).forEach(key => {
      if (key === 'dateOfBirth') {
        const currentDate = currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : null
        const newDate = data.dateOfBirth
        if (currentDate !== newDate) {
          updatedFields.push(key)
        }
      } else if (key in currentUser && (currentUser as any)[key] !== (data as any)[key]) {
        updatedFields.push(key)
      }
    })
  }

  if (updatedFields.length > 0) {
    await logActivity(event, {
      userId: session.user.id,
      type: 'PROFILE_UPDATED',
      description: 'User updated their profile',
      metadata: { updatedFields: Object.keys(data) },
      resourceId: session.user.id.toString(),
      resourceType: 'user',
    })
  }

  if (currentUser && currentUser.newsletterSubscribed !== data.newsletterSubscribed) {
    await logActivity(event, {
      userId: session.user.id,
      type: data.newsletterSubscribed ? 'NEWSLETTER_SUBSCRIBED' : 'NEWSLETTER_UNSUBSCRIBED',
      description: data.newsletterSubscribed ? 'Subscribed to newsletter' : 'Unsubscribed from newsletter',
    })
  }

  await setUserSession(event, {
    ...session,
    user: { ...session.user, ...updatedUser },
  })

  return { user: updatedUser }
})

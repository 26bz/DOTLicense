import prisma from '~~/lib/prisma'
import { viewLicense } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, viewLicense, session.user, { userId: session.user.id })

  const [licenses, purchases, subscriptions] = await Promise.all([
    prisma.license.count({ where: { userId: session.user.id } }),
    prisma.purchase.count({ where: { userId: session.user.id } }),
    prisma.subscription.count({ where: { userId: session.user.id } }),
  ])

  return { stats: { licenses, purchases, subscriptions } }
})

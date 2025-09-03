import prisma from '~~/lib/prisma'
import { viewAnalytics } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, viewAnalytics, session.user)

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const months = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1)
    months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
      name: date.toLocaleDateString('en-US', { month: 'short' }),
    })
  }

  const userStats = await Promise.all(
    months.map(async ({ month, year }) => {
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0, 23, 59, 59)

      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
      return count
    })
  )

  const newsletterStats = await Promise.all(
    months.map(async ({ month, year }) => {
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0, 23, 59, 59)

      const count = await prisma.user.count({
        where: {
          newsletterSubscribed: true,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
      return count
    })
  )

  const activityStats = await Promise.all(
    months.map(async ({ month, year }) => {
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0, 23, 59, 59)

      const purchases = await prisma.activityLog.count({
        where: {
          type: 'PURCHASE_COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })

      const downloads = await prisma.activityLog.count({
        where: {
          type: 'PRODUCT_DOWNLOADED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })

      const licenses = await prisma.activityLog.count({
        where: {
          type: 'LICENSE_ACTIVATED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })

      return { purchases, downloads, licenses }
    })
  )

  const totalUsers = await prisma.user.count()
  const totalProducts = await prisma.activityLog.count({
    where: { type: 'PRODUCT_DOWNLOADED' },
  })
  const totalLicenses = await prisma.activityLog.count({
    where: { type: 'LICENSE_ACTIVATED' },
  })
  const totalPurchases = await prisma.activityLog.count({
    where: { type: 'PURCHASE_COMPLETED' },
  })

  return {
    overview: {
      users: totalUsers,
      products: totalProducts,
      licenses: totalLicenses,
      revenue: totalPurchases * 25,
    },
    charts: {
      months: months.map(m => m.name),
      users: userStats,
      newsletter: newsletterStats,
      purchases: activityStats.map(s => s.purchases),
      downloads: activityStats.map(s => s.downloads),
      licenses: activityStats.map(s => s.licenses),
      revenue: activityStats.map(s => s.purchases * 25),
    },
  }
})

import prisma from '~~/lib/prisma'
import type { H3Event } from 'h3'
import { viewAnalytics } from '~~/shared/utils/abilities'

export default defineEventHandler(async (event: H3Event) => {
  const session = await requireUserSession(event)
  await authorize(event, viewAnalytics, session.user)

  const query = getQuery(event)
  const period = (query.period as string) || '30d' // 7d, 30d, 90d, 1y
  const category = query.category as string

  const now = new Date()
  let startDate = new Date()

  switch (period) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  const dateFilter = { gte: startDate, lte: now }
  const categoryFilter = category ? { categoryId: category } : {}

  const [totalRevenue, monthlyRevenue, completedPurchases, refundedPurchases, activeSubscriptions, topProducts, revenueByCategory, userGrowth, conversionMetrics] =
    await Promise.all([
      // Total revenue
      prisma.purchase.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: dateFilter,
          product: categoryFilter,
        },
        _sum: { amount: true },
        _count: true,
      }),

      prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(amount) as revenue,
        COUNT(*) as orders
      FROM "Purchase" 
      WHERE status = 'COMPLETED' 
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${now}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `,

      prisma.purchase.findMany({
        where: {
          createdAt: dateFilter,
          product: categoryFilter,
        },
        select: {
          status: true,
          amount: true,
          createdAt: true,
          refunded: true,
        },
      }),

      prisma.purchase.aggregate({
        where: {
          refunded: true,
          refundedAt: dateFilter,
          product: categoryFilter,
        },
        _sum: { refundAmount: true },
        _count: true,
      }),

      prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          product: categoryFilter,
        },
      }),

      prisma.product.findMany({
        where: categoryFilter,
        select: {
          id: true,
          name: true,
          price: true,
          purchaseCount: true,
          downloadCount: true,
          category: {
            select: { name: true },
          },
          _count: {
            select: {
              purchase: {
                where: {
                  status: 'COMPLETED',
                  createdAt: dateFilter,
                },
              },
            },
          },
        },
        orderBy: {
          purchaseCount: 'desc',
        },
        take: 10,
      }),

      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          products: {
            select: {
              purchase: {
                where: {
                  status: 'COMPLETED',
                  createdAt: dateFilter,
                },
                select: {
                  amount: true,
                },
              },
            },
          },
        },
      }),

      prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(*) as new_users
      FROM "User" 
      WHERE "createdAt" >= ${startDate}
        AND "createdAt" <= ${now}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `,

      prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT p."userId") as unique_buyers,
        COUNT(*) as total_purchases,
        AVG(p.amount) as avg_order_value
      FROM "Purchase" p
      WHERE p.status = 'COMPLETED'
        AND p."createdAt" >= ${startDate}
        AND p."createdAt" <= ${now}
    `,
    ])

  const categoryRevenue = revenueByCategory
    .map((cat: any) => ({
      name: cat.name,
      revenue: cat.purchase?.reduce((total: number, purchase: any) => total + purchase.amount, 0) || 0,
    }))
    .filter(cat => cat.revenue > 0)

  const totalRevenueAmount = totalRevenue._sum.amount || 0
  const refundRate = totalRevenue._count > 0 ? (refundedPurchases._count / totalRevenue._count) * 100 : 0
  const avgOrderValue = totalRevenue._count > 0 ? totalRevenueAmount / totalRevenue._count : 0

  const monthlyData = (monthlyRevenue as any[]).map(row => ({
    month: new Date(row.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    revenue: Number(row.revenue) / 100, // Converted cents to dollars
    orders: Number(row.orders),
  }))

  return {
    overview: {
      totalRevenue: totalRevenueAmount / 100, // Converted to dollars
      totalOrders: totalRevenue._count,
      avgOrderValue: avgOrderValue / 100,
      refundRate: Math.round(refundRate * 100) / 100,
      activeSubscriptions,
      refundedAmount: (refundedPurchases._sum.refundAmount || 0) / 100,
    },
    charts: {
      monthlyRevenue: monthlyData,
      topProducts: topProducts.map(p => ({
        name: p.name,
        revenue: (p._count.purchase * p.price) / 100,
        sales: p._count.purchase,
        category: p.category?.name || 'Uncategorized',
      })),
      categoryRevenue: categoryRevenue.map(c => ({
        name: c.name,
        value: c.revenue / 100,
      })),
      userGrowth: (userGrowth as any[]).map(row => ({
        date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: Number(row.new_users),
      })),
    },
    filters: {
      period,
      category: category || 'all',
    },
  }
})

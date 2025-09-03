import { logActivityDirect } from '~~/server/utils/activity'
import type { ActivityType } from '@prisma/client'

function getActivityType(event: any): ActivityType | null {
  const url = event.node.req.url
  const method = event.node.req.method

  if (url?.includes('/products/') && url?.includes('/view')) return 'PRODUCT_VIEWED'
  if (method === 'POST' && url?.includes('/purchases')) return 'PURCHASE_INITIATED'
  if (method === 'POST' && url?.includes('/cart')) return 'CART_ITEM_ADDED'
  if (method === 'DELETE' && url?.includes('/cart')) return 'CART_ITEM_REMOVED'
  if (url?.includes('/licenses/') && url?.includes('/activate')) return 'LICENSE_ACTIVATED'

  return null
}

function shouldLogRequest(url: string): boolean {
  if (url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) return false
  if (url === '/health' || url === '/_nuxt/' || url.startsWith('/__')) return false
  if (url.startsWith('/api/_')) return false
  if (url.includes('/api/user/activity')) return false
  if (url.includes('/api/user/stats')) return false
  if (url.includes('/api/user/me')) return false
  if (url.includes('/api/user/last-login')) return false
  if (url.includes('/api/announcements')) return false
  if (url.includes('/api/products/public')) return false
  if (url.includes('/_auth/session')) return false
  if (url.includes('/_nuxt_icon/')) return false

  return url.startsWith('/api/')
}

export default defineEventHandler(async event => {
  const url = event.node.req.url || ''

  if (!shouldLogRequest(url)) return

  const startTime = Date.now()
  const session = await getUserSession(event)

  if (!session?.user?.id) return

  const activityType = getActivityType(event)
  if (activityType && session.user) {
    const userId = session.user.id
    setImmediate(async () => {
      try {
        await logActivityDirect({
          userId,
          type: activityType,
          description: `${event.node.req.method} ${url}`,
          ipAddress: getRequestIP(event),
          userAgent: getHeader(event, 'user-agent'),
          metadata: {
            duration: Date.now() - startTime,
          },
        })
      } catch (err) {
        console.error('Activity logging failed:', err)
      }
    })
  }
})

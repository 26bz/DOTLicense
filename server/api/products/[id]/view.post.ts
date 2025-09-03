import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const productId = getRouterParam(event, 'id')
  const session = await getUserSession(event)

  // This endpoint can be called by both authenticated and unauthenticated users
  // Only logged for authenticated users though
  if (session?.user?.id && productId) {
    await logActivity(event, {
      userId: session.user.id,
      type: 'PRODUCT_VIEWED',
      description: `Viewed product ${productId}`,
      resourceId: productId,
      resourceType: 'product',
    })
  }

  return { success: true }
})

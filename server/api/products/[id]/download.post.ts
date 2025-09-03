import prisma from '~~/lib/prisma'
import { getHeader, getRequestIP, H3Event } from 'h3'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  const productId = event.context.params?.id
  if (!productId) throw createError({ statusCode: 400, statusMessage: 'Product ID missing' })

  const session = await requireUserSession(event)

  try {
    const license = await prisma.license.findFirst({
      where: {
        userId: session.user.id,
        productId,
        revoked: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: { product: true },
    })

    if (!license) {
      throw createError({ statusCode: 403, statusMessage: 'No valid license found' })
    }

    const ip = getRequestIP(event) || ''
    const userAgent = getHeader(event, 'user-agent') || ''

    await prisma.download.create({
      data: { userId: session.user.id, productId, licenseId: license.id, ipAddress: ip, userAgent },
    })

    await prisma.product.update({
      where: { id: productId },
      data: { downloadCount: { increment: 1 } },
    })

    await logActivity(event, {
      userId: session.user.id,
      type: 'PRODUCT_DOWNLOADED',
      description: `Downloaded product ${license.product.name}`,
      resourceId: productId,
      resourceType: 'product',
      metadata: { licenseId: license.id, productName: license.product.name },
    })

    return { downloadUrl: license.product.fileUrl, filename: license.product.fileName }
  } catch (err) {
    console.error('Download error:', err)
    throw createError({ statusCode: 500, statusMessage: 'Download failed' })
  }
})

import { createError } from 'h3'
import prisma from '~~/lib/prisma'
import { manageUsers } from '~~/shared/utils/abilities'

export default defineEventHandler(async event => {
  try {
    const session = await requireUserSession(event)
    await authorize(event, manageUsers, session.user)

    const userId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      })
    }

    if (typeof body.isPermitted !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'isPermitted must be a boolean value',
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { isPermitted: body.isPermitted },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isPermitted: true,
      },
    })

    return {
      success: true,
      user: updatedUser,
      message: `User ${body.isPermitted ? 'reactivated' : 'suspended'} successfully`,
    }
  } catch (error: any) {
    console.error('Error updating user status:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user status',
    })
  }
})

import { defineAbility, allow, deny } from 'nuxt-authorization/utils'
import type { Role } from '@prisma/client'

export const viewDashboard = defineAbility((user?: { id: number }) => {
  return user ? allow() : deny()
})

export const updateUser = defineAbility((user: { id: number }, targetUser: { id: number }) => {
  return user.id === targetUser.id ? allow() : deny()
})

export const viewLicense = defineAbility((user: { id: number }, license: { userId: number }) => {
  return user.id === license.userId ? allow() : deny()
})

export const viewServices = defineAbility({ allowGuest: true }, () => true)

export const createService = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const updateService = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const deleteService = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

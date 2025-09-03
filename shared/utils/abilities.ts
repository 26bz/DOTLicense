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

export const manageProducts = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const viewCategory = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const updateCategory = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const deleteCategory = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const createAnnouncement = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const updateAnnouncement = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const deleteAnnouncement = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const viewAdminDashboard = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const manageUsers = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const viewAnalytics = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const uploadFiles = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

export const createCategory = defineAbility((user?: { id: number; role?: Role }) => {
  return user?.role === 'ADMIN' ? allow() : deny()
})

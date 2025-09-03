import { z } from 'zod'

export const ActivityDataSchema = z.object({
  userId: z
    .number()
    .or(z.string())
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val)),
  type: z.string(),
  description: z.string().optional(),
  metadata: z.union([z.record(z.string(), z.unknown()), z.null(), z.undefined()]).optional(),
  resourceId: z.string().optional(),
  resourceType: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
  referrer: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  device: z.string().optional(),
})

export type ActivityData = z.infer<typeof ActivityDataSchema>

export const ActivityType = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  UPDATE_PROFILE: 'update_profile',
  UPDATE_PASSWORD: 'update_password',
  DOWNLOAD_PRODUCT: 'download_product',
  VIEW_PRODUCT: 'view_product',
  UPLOAD_FILE: 'upload_file',
  CREATE_ANNOUNCEMENT: 'create_announcement',
  UPDATE_ANNOUNCEMENT: 'update_announcement',
  DELETE_ANNOUNCEMENT: 'delete_announcement',
  CREATE_CATEGORY: 'create_category',
  UPDATE_CATEGORY: 'update_category',
  DELETE_CATEGORY: 'delete_category',
  CREATE_PRODUCT: 'create_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',
  CREATE_SERVICE: 'create_service',
  UPDATE_SERVICE: 'update_service',
  DELETE_SERVICE: 'delete_service',
  MANAGE_USER: 'manage_user',
  ADMIN_ACTION: 'admin_action',
} as const

export type ActivityTypeValue = (typeof ActivityType)[keyof typeof ActivityType]

export const LoginMetadataSchema = z.object({
  success: z.boolean(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  device: z.string().optional(),
})

export const FileUploadMetadataSchema = z.object({
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  uploadPath: z.string().optional(),
})

export const ProductDownloadMetadataSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  licenseId: z.string().optional(),
})

export const ContentManagementMetadataSchema = z.object({
  itemId: z.string(),
  itemName: z.string(),
  action: z.string().optional(),
})

export const UserManagementMetadataSchema = z.object({
  targetUserId: z.string(),
  targetUserEmail: z.string().optional(),
  action: z.string(),
})

export const ActivityLogSchema = z.object({
  id: z
    .string()
    .or(z.number())
    .transform(val => String(val)),
  userId: z
    .string()
    .or(z.number())
    .transform(val => String(val)),
  type: z.string(),
  metadata: z.union([
    z.record(z.string(), z.unknown()),
    z.string().transform(val => {
      try {
        return JSON.parse(val)
      } catch {
        return { raw: val }
      }
    }),
    z.null(),
  ]),
  createdAt: z.string().or(z.date()),
  user: z
    .object({
      id: z
        .string()
        .or(z.number())
        .transform(val => String(val)),
      email: z.string(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    })
    .optional(),
})

export type ActivityLog = z.infer<typeof ActivityLogSchema>

export const ActivityConfig = {
  icons: {
    [ActivityType.LOGIN]: 'i-heroicons-arrow-right-end-on-rectangle',
    [ActivityType.LOGOUT]: 'i-heroicons-arrow-left-start-on-rectangle',
    [ActivityType.REGISTER]: 'i-heroicons-user-plus',
    [ActivityType.UPDATE_PROFILE]: 'i-heroicons-user',
    [ActivityType.UPDATE_PASSWORD]: 'i-heroicons-key',
    [ActivityType.DOWNLOAD_PRODUCT]: 'i-heroicons-arrow-down-tray',
    [ActivityType.VIEW_PRODUCT]: 'i-heroicons-eye',
    [ActivityType.UPLOAD_FILE]: 'i-heroicons-arrow-up-tray',
    [ActivityType.CREATE_ANNOUNCEMENT]: 'i-heroicons-megaphone',
    [ActivityType.UPDATE_ANNOUNCEMENT]: 'i-heroicons-megaphone',
    [ActivityType.DELETE_ANNOUNCEMENT]: 'i-heroicons-megaphone',
    [ActivityType.CREATE_CATEGORY]: 'i-heroicons-folder-plus',
    [ActivityType.UPDATE_CATEGORY]: 'i-heroicons-folder',
    [ActivityType.DELETE_CATEGORY]: 'i-heroicons-folder-minus',
    [ActivityType.CREATE_PRODUCT]: 'i-heroicons-plus-circle',
    [ActivityType.UPDATE_PRODUCT]: 'i-heroicons-pencil-square',
    [ActivityType.DELETE_PRODUCT]: 'i-heroicons-trash',
    [ActivityType.CREATE_SERVICE]: 'i-heroicons-plus-circle',
    [ActivityType.UPDATE_SERVICE]: 'i-heroicons-pencil-square',
    [ActivityType.DELETE_SERVICE]: 'i-heroicons-trash',
    [ActivityType.MANAGE_USER]: 'i-heroicons-users',
    [ActivityType.ADMIN_ACTION]: 'i-heroicons-shield-check',
  },
  colors: {
    [ActivityType.LOGIN]: 'green',
    [ActivityType.LOGOUT]: 'orange',
    [ActivityType.REGISTER]: 'blue',
    [ActivityType.UPDATE_PROFILE]: 'blue',
    [ActivityType.UPDATE_PASSWORD]: 'yellow',
    [ActivityType.DOWNLOAD_PRODUCT]: 'purple',
    [ActivityType.VIEW_PRODUCT]: 'gray',
    [ActivityType.UPLOAD_FILE]: 'indigo',
    [ActivityType.CREATE_ANNOUNCEMENT]: 'green',
    [ActivityType.UPDATE_ANNOUNCEMENT]: 'yellow',
    [ActivityType.DELETE_ANNOUNCEMENT]: 'red',
    [ActivityType.CREATE_CATEGORY]: 'green',
    [ActivityType.UPDATE_CATEGORY]: 'yellow',
    [ActivityType.DELETE_CATEGORY]: 'red',
    [ActivityType.CREATE_PRODUCT]: 'green',
    [ActivityType.UPDATE_PRODUCT]: 'yellow',
    [ActivityType.DELETE_PRODUCT]: 'red',
    [ActivityType.CREATE_SERVICE]: 'green',
    [ActivityType.UPDATE_SERVICE]: 'yellow',
    [ActivityType.DELETE_SERVICE]: 'red',
    [ActivityType.MANAGE_USER]: 'blue',
    [ActivityType.ADMIN_ACTION]: 'purple',
  },
}

export function getActivityIcon(type: string): string {
  return ActivityConfig.icons[type as ActivityTypeValue] || 'i-heroicons-information-circle'
}

export function getActivityColor(type: string): string {
  return ActivityConfig.colors[type as ActivityTypeValue] || 'gray'
}

export function formatActivityTitle(activity: ActivityLog): string {
  const type = activity.type
  const metadata = activity.metadata
  const user = activity.user
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Unknown User'

  switch (type) {
    case ActivityType.LOGIN:
      return metadata?.success ? `${userName} logged in` : `${userName} failed to log in`
    case ActivityType.LOGOUT:
      return `${userName} logged out`
    case ActivityType.REGISTER:
      return `${userName} registered`
    case ActivityType.UPDATE_PROFILE:
      return `${userName} updated their profile`
    case ActivityType.UPDATE_PASSWORD:
      return `${userName} changed their password`
    case ActivityType.DOWNLOAD_PRODUCT:
      return `${userName} downloaded ${metadata?.productName || 'a product'}`
    case ActivityType.VIEW_PRODUCT:
      return `${userName} viewed ${metadata?.productName || 'a product'}`
    case ActivityType.UPLOAD_FILE:
      return `${userName} uploaded ${metadata?.fileName || 'a file'}`
    case ActivityType.CREATE_ANNOUNCEMENT:
      return `${userName} created announcement "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.UPDATE_ANNOUNCEMENT:
      return `${userName} updated announcement "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.DELETE_ANNOUNCEMENT:
      return `${userName} deleted announcement "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.CREATE_CATEGORY:
      return `${userName} created category "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.UPDATE_CATEGORY:
      return `${userName} updated category "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.DELETE_CATEGORY:
      return `${userName} deleted category "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.CREATE_PRODUCT:
      return `${userName} created product "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.UPDATE_PRODUCT:
      return `${userName} updated product "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.DELETE_PRODUCT:
      return `${userName} deleted product "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.CREATE_SERVICE:
      return `${userName} created service "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.UPDATE_SERVICE:
      return `${userName} updated service "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.DELETE_SERVICE:
      return `${userName} deleted service "${metadata?.itemName || 'Unknown'}"`
    case ActivityType.MANAGE_USER:
      return `${userName} ${metadata?.action || 'managed'} user ${metadata?.targetUserEmail || 'Unknown'}`
    case ActivityType.ADMIN_ACTION:
      return `${userName} performed admin action`
    default:
      return `${userName} performed ${type}`
  }
}

export function formatActivityDate(date: string | Date): string {
  const activityDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - activityDate.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  } else {
    return activityDate.toLocaleDateString()
  }
}

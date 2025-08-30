import type { Role } from '@prisma/client'

declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    userName: string
    email?: string
    role: Role
    dateOfBirth?: Date
    emailVerified?: boolean
    isPermitted?: boolean
    newsletterSubscribed?: boolean
    street?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    country?: string | null
  }

  interface UserSession {
    user: User
    loggedInAt: Date
    sessionId: string
  }

  interface SecureSessionData {
    sessionId: string
    ipAddress?: string
    userAgent?: string
  }
}

export {}

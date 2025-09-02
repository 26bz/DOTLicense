import type { Role } from '@prisma/client'

declare module '#auth-utils' {
  interface User {
    id: number
    userName: string
    email: string
    role: Role
    isPermitted?: boolean
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

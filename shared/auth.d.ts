declare module '#auth-utils' {
  interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    emailVerified: boolean;
    isPermitted: boolean;
  }

  interface UserSession {
    user: User;
    loggedInAt: Date;
    sessionId: string;
  }

  interface SecureSessionData {
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
  }
}

export {};

declare module '#auth-utils' {
  interface User {
    id: number;
    name: string;
    userName: string;
    email: string;
    role: Role;
    dateOfBirth: Date;
    emailVerified: boolean;
    isPermitted: boolean;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    newsletterSubscribed?: boolean;
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

import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: 'ADMIN' | 'DATA_MANAGER' | 'VALIDATOR' | 'VIEWER'
    }
  }

  interface User {
    role: 'ADMIN' | 'DATA_MANAGER' | 'VALIDATOR' | 'VIEWER'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'DATA_MANAGER' | 'VALIDATOR' | 'VIEWER'
  }
}

// types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface User {
    roles?: string
    phone: string
  }

  interface Session {
    user?: {
      id?: string
      name?: string
      email?: string
      image?: string
      role?: string
      phone: string
    }
  }
}

import NextAuth from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        phone: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("Invalid credentials")
        }
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone as string },
        })
        if (!user || !user.password) {
          throw new Error("User not found")
        }
        const isPasswordValid = bcrypt.compareSync(
          credentials.password as string,
          user.password
        )
        if (!isPasswordValid || user.status !== "ACTIVE") {
          throw new Error("Invalid password")
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.roles
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
        session.user.phone = token.phone as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === "development",
  trustHost: true,
})

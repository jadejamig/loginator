import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "./lib/db"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
 
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole
    } & DefaultSession["user"]
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      
      // google and github signin are automatically email verified
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;

      const existingUser = await getUserById(user.id);

      // Prevent signin unverified emails
      if (!existingUser || !existingUser.emailVerified) return false

      // TODO: Add 2FA check
      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token
      token.role = existingUser.role

      return token
    }
  },
  events: {
    async linkAccount({ user }) {

      if (!user.id)
        return;

      await db.user.update({
        where: {id: user.id},
        data: { emailVerified: new Date() }
      })
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  }
})
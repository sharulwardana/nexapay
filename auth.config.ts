import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import type { NextAuthConfig } from "next-auth"

export default {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      checks: ["state"],
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      checks: ["state"],
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role as string;
        }
        if (token.loyaltyPoints !== undefined) {
          session.user.loyaltyPoints = token.loyaltyPoints as number;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;

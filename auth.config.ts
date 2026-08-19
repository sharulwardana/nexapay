import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import type { NextAuthConfig } from "next-auth"

export default {
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
      if (!token || !token.sub) {
        return null as unknown as typeof session;
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      if (token.loyaltyPoints !== undefined && session.user) {
        session.user.loyaltyPoints = token.loyaltyPoints as number;
      }
      return session;
    },
    // NOTE: JWT callback is intentionally NOT defined here.
    // The full JWT callback (with DB lookups) lives in auth.ts only,
    // which overrides this config. Keeping JWT logic in one place
    // prevents dead code and confusion about which callback runs.
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;

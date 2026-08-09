import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import type { NextAuthConfig } from "next-auth"
import { isAdminEmail } from "@/lib/auth-helpers"

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
        return null as any;
      }
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token?.role && session.user) {
        session.user.role = token.role as string;
      }
      if (token?.loyaltyPoints !== undefined && session.user) {
        session.user.loyaltyPoints = token.loyaltyPoints as number;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role || 'USER';
        token.loyaltyPoints = (user as any).loyaltyPoints || 0;
      }
      if (token?.email && isAdminEmail(token.email)) {
        token.role = 'ADMIN';
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;

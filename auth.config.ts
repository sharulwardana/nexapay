import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import prisma from "@/lib/prisma"

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      checks: ["state"],
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      checks: ["state"],
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { default: prisma } = await import("@/lib/prisma");
        const { default: bcrypt } = await import("bcryptjs");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          return null;
        }

        // Compare hashed password with bcrypt
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (isPasswordValid) {
          return user;
        }

        return null;
      }
    })
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
      }
      
      // Fetch latest data from DB for real-time rank and role
      if (token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
            select: { role: true, loyaltyPoints: true }
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.loyaltyPoints = dbUser.loyaltyPoints;
          } else {
            // User was deleted from DB (stale session cookie) -> clear token
            return {};
          }
        } catch (error) {
          console.error("JWT fetch user error:", error);
        }
      }
      
      return token;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;

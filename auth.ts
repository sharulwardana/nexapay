import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"
import { isAdminEmail } from "@/lib/admin-check"

// Extend the JWT type to include our custom fields
declare module "next-auth" {
  interface JWT {
    role?: string;
    loyaltyPoints?: number;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role || 'USER';
        token.loyaltyPoints = user.loyaltyPoints || 0;
      }

      // Check admin status from centralized config
      if (token?.email && isAdminEmail(token.email)) {
        token.role = 'ADMIN';
      } else if (token?.sub) {
        // Refresh role & loyalty from DB for non-admin users
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true, loyaltyPoints: true }
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.loyaltyPoints = dbUser.loyaltyPoints;
          }
        } catch (e) {
          console.error(e);
        }
      }
      return token;
    }
  },
  providers: [
    ...authConfig.providers,
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          return null;
        }

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
  ]
})

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_DISCORD_ID: z.string().optional(),
  AUTH_DISCORD_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ADMIN_EMAILS: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional().default('mailto:support@nexapay.com'),
});

export const env = envSchema.parse(process.env);
export default env;

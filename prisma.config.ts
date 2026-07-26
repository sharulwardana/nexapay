import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Load .env.local since Next.js stores local env vars there
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env just in case

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});


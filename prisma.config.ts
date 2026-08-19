import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Load .env.local since Next.js stores local env vars there
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env just in case

// Use DIRECT_URL for migrations / db push (port 5432) to avoid transaction pooler hanging on port 6543
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: dbUrl,
  },
});

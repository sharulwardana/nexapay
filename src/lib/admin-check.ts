/**
 * Edge-compatible super-admin email check.
 * Pure JS function without Prisma or Node.js native module dependencies.
 * Safe to import in Edge Middleware and auth.config.ts.
 */
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
  : [];

if (ADMIN_EMAILS.length === 0 && typeof process !== 'undefined') {
  console.warn(
    '[NexaPay] WARNING: ADMIN_EMAILS environment variable is not set. ' +
    'No users will have admin access. Set ADMIN_EMAILS in .env.local (comma-separated).'
  );
}

export function isAdminEmail(email: string): boolean {
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

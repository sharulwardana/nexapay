/**
 * Edge-compatible super-admin email check.
 * Pure JS function without Prisma or Node.js native module dependencies.
 * Safe to import in Edge Middleware and auth.config.ts.
 */
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
  : ['admin@nexapay.com'];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

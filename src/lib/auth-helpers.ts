import prisma from '@/lib/prisma';
import { auth } from '@/../auth';

/**
 * Centralized list of super-admin emails.
 * Reads from the ADMIN_EMAILS env var (comma-separated).
 * Falls back to a default list when the env var is not set.
 */
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
  : ['admin@nexapay.com'];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Guard for server actions that require admin privileges.
 * Checks both the session JWT and the database role.
 * Throws if the caller is not authenticated or not an admin.
 *
 * @returns The authenticated session.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }

  return session;
}

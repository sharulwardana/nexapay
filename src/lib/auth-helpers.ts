import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import { isAdminEmail } from '@/lib/admin-check';

export { isAdminEmail };

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

import logger from '@/lib/logger';

export interface AdminAuditEntry {
  adminId: string;
  adminEmail?: string;
  action: 'UPDATE_TRANSACTION_STATUS' | 'UPDATE_USER_BALANCE' | 'UPDATE_USER_ROLE' | 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'CREATE_PROMO' | 'UPDATE_BANNER';
  targetId: string;
  targetType: 'transaction' | 'user' | 'product' | 'promo' | 'banner';
  details?: Record<string, unknown>;
  ip?: string;
}

/**
 * Log an administrative action with structured audit metadata.
 */
export function logAdminAudit(entry: AdminAuditEntry) {
  logger.info(`[ADMIN AUDIT] ${entry.action} on ${entry.targetType} ${entry.targetId}`, {
    ...entry,
    timestamp: new Date().toISOString(),
  });
}

export default logAdminAudit;

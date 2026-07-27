import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateInvoiceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NXP-${timestamp}-${random}`;
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: 'tahun', seconds: 31536000 },
    { label: 'bulan', seconds: 2592000 },
    { label: 'minggu', seconds: 604800 },
    { label: 'hari', seconds: 86400 },
    { label: 'jam', seconds: 3600 },
    { label: 'menit', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label} lalu`;
  }
  return 'baru saja';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'text-yellow-500 bg-yellow-500/10',
    PROCESSING: 'text-blue-500 bg-blue-500/10',
    COMPLETED: 'text-green-500 bg-green-500/10',
    FAILED: 'text-red-500 bg-red-500/10',
    REFUNDED: 'text-purple-500 bg-purple-500/10',
  };
  return colors[status] || 'text-muted-foreground bg-muted';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Menunggu Pembayaran',
    PROCESSING: 'Sedang Diproses',
    COMPLETED: 'Selesai',
    FAILED: 'Gagal',
    REFUNDED: 'Dikembalikan',
  };
  return labels[status] || status;
}

export function formatPaymentMethod(method: string): string {
  if (!method) return '-';
  const m = method.toUpperCase();
  if (m === 'TRANSFER_MANUAL') return 'Transfer Bank Manual';
  if (m === 'QRIS') return 'QRIS';
  if (m === 'E-WALLET' || m === 'EWALLET') return 'E-Wallet';
  if (m === 'BANK_TRANSFER' || m === 'VA') return 'Virtual Account';
  if (m === 'MINIMARKET') return 'Minimarket';
  return method.replace(/_/g, ' ');
}

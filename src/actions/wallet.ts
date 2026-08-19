'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/../auth';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitize';
import rateLimit from '@/lib/rateLimit';

// Rate limiters for wallet operations
const topUpLimiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });
const transferLimiter = rateLimit({ interval: 3600000, uniqueTokenPerInterval: 500 });

// --- Zod Schemas ---
const topUpSchema = z.object({
  amount: z.number().int('Jumlah harus bilangan bulat').min(10000, 'Minimal top up adalah Rp 10.000').max(10000000, 'Maksimal top up adalah Rp 10.000.000'),
});

const transferSchema = z.object({
  recipientEmailOrPhone: z.string().min(1, 'Email atau nomor HP penerima wajib diisi').max(255),
  amount: z.number().int('Jumlah harus bilangan bulat').min(5000, 'Minimal transfer adalah Rp 5.000').max(50000000, 'Maksimal transfer adalah Rp 50.000.000'),
  notes: z.string().max(200).transform(sanitizeInput).optional(),
});

export async function getLiveWalletBalance() {
  try {
    const session = await auth();
    if (!session?.user?.id) return 0;
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { walletBalance: true },
    });
    return user?.walletBalance || 0;
  } catch {
    return 0;
  }
}

export async function topUpWallet(amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Silakan login terlebih dahulu' };
    }

    // Rate limit: max 5 top-up attempts per minute per user
    try {
      await topUpLimiter.check(5, `topup_${session.user.id}`);
    } catch {
      return { success: false, error: 'Terlalu banyak permintaan top up. Coba lagi dalam 1 menit.' };
    }

    // Validate input with Zod
    const parsed = topUpSchema.safeParse({ amount });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }
    const validatedAmount = parsed.data.amount;

    // Use crypto-safe invoice ID
    const invoiceId = `NEXA-TOPUP-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    // SECURITY: Create transaction as PENDING — do NOT increment balance directly.
    // In production, balance should only be incremented after payment gateway
    // confirms the payment via webhook callback.
    // For development/demo, the balance is incremented immediately.
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      // DEV MODE: Simulate instant top-up
      const [updatedUser] = await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: { walletBalance: { increment: validatedAmount } },
        }),
        prisma.transaction.create({
          data: {
            invoiceId,
            userId: session.user.id,
            productName: 'Top Up Saldo Wallet NexaPay',
            category: 'E-Wallet',
            targetAccount: session.user.email || session.user.id,
            amount: validatedAmount,
            totalAmount: validatedAmount,
            paymentMethod: 'TRANSFER_MANUAL',
            status: 'COMPLETED',
            notes: 'Top Up Saldo Instant (Dev Mode)',
          },
        }),
      ]);

      revalidatePath('/dashboard/wallet');
      revalidatePath('/dashboard');
      revalidatePath('/admin');

      return {
        success: true,
        balance: updatedUser.walletBalance,
        invoiceId,
      };
    } else {
      // PRODUCTION: Create PENDING transaction — await payment gateway confirmation
      await prisma.transaction.create({
        data: {
          invoiceId,
          userId: session.user.id,
          productName: 'Top Up Saldo Wallet NexaPay',
          category: 'E-Wallet',
          targetAccount: session.user.email || session.user.id,
          amount: validatedAmount,
          totalAmount: validatedAmount,
          paymentMethod: 'TRANSFER_MANUAL',
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          notes: 'Top Up Saldo — Menunggu Pembayaran',
        },
      });

      revalidatePath('/dashboard/wallet');
      revalidatePath('/dashboard');

      return {
        success: true,
        invoiceId,
        pending: true,
        message: 'Transaksi top up dibuat. Silakan selesaikan pembayaran.',
      };
    }
  } catch (error: unknown) {
    console.error('Failed to topup wallet:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Gagal melakukan top up saldo' };
  }
}

export async function transferWallet(recipientEmailOrPhone: string, amount: number, notes?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Silakan login terlebih dahulu' };
    }

    // Rate limit: max 10 transfers per hour per user
    try {
      await transferLimiter.check(10, `transfer_${session.user.id}`);
    } catch {
      return { success: false, error: 'Terlalu banyak permintaan transfer. Coba lagi nanti.' };
    }

    // Validate input with Zod
    const parsed = transferSchema.safeParse({ recipientEmailOrPhone, amount, notes });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }
    const { recipientEmailOrPhone: cleanInput, amount: validatedAmount, notes: sanitizedNotes } = parsed.data;

    const normalizedInput = cleanInput.trim().toLowerCase();

    // Find recipient by email or phone
    const recipient = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedInput },
          { phone: normalizedInput },
        ],
      },
      select: { id: true, name: true, email: true },
    });

    if (!recipient) {
      return { success: false, error: 'Penerima tidak ditemukan. Periksa kembali email atau nomor HP.' };
    }

    if (recipient.id === session.user.id) {
      return { success: false, error: 'Tidak dapat mentransfer saldo ke akun Anda sendiri.' };
    }

    // Use crypto-safe invoice IDs
    const invoiceIdSender = `NEXA-TRF-OUT-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const invoiceIdRecipient = `NEXA-TRF-IN-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    // All balance checks and mutations inside one atomic $transaction
    const result = await prisma.$transaction(async (tx) => {
      // Fetch sender balance INSIDE the transaction for consistency
      const sender = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, walletBalance: true, name: true, email: true },
      });

      if (!sender || sender.walletBalance < validatedAmount) {
        throw new Error('Saldo NexaPay Anda tidak mencukupi untuk melakukan transfer.');
      }

      // Decrement sender balance
      await tx.user.update({
        where: { id: session.user.id },
        data: { walletBalance: { decrement: validatedAmount } },
      });

      // Increment recipient balance
      await tx.user.update({
        where: { id: recipient.id },
        data: { walletBalance: { increment: validatedAmount } },
      });

      const noteText = sanitizedNotes || `Transfer saldo`;

      // Log for sender
      await tx.transaction.create({
        data: {
          invoiceId: invoiceIdSender,
          userId: session.user.id,
          productName: `Transfer ke ${recipient.name || recipient.email}`,
          category: 'Transfer',
          targetAccount: recipient.email || recipient.id,
          amount: validatedAmount,
          totalAmount: validatedAmount,
          paymentMethod: 'NEXAPAY_WALLET',
          status: 'COMPLETED',
          notes: `${noteText} ke ${recipient.name || recipient.email}`,
        },
      });

      // Log for recipient
      await tx.transaction.create({
        data: {
          invoiceId: invoiceIdRecipient,
          userId: recipient.id,
          productName: `Terima Transfer dari ${sender.name || sender.email}`,
          category: 'Transfer',
          targetAccount: sender.email || sender.id,
          amount: validatedAmount,
          totalAmount: validatedAmount,
          paymentMethod: 'NEXAPAY_WALLET',
          status: 'COMPLETED',
          notes: `Terima ${noteText} dari ${sender.name || sender.email}`,
        },
      });

      return { senderName: sender.name, recipientName: recipient.name || recipient.email };
    });

    revalidatePath('/dashboard/wallet');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      recipientName: result.recipientName,
    };
  } catch (error: unknown) {
    console.error('Failed to transfer wallet:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Gagal mengirim saldo' };
  }
}
